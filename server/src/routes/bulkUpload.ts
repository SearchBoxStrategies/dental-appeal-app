import { Router } from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { db } from '../db';
import { authenticate } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// Parse CSV date helper
const parseDate = (dateStr: string): string => {
  const formats = ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY'];
  for (const format of formats) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
};

router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  const file = req.file;
  const practiceId = req.user!.practiceId;
  const userId = req.user!.userId;
  
  if (!file) return res.status(400).json({ error: 'No file uploaded' });
  
  const { rows: [batch] } = await db.query(
    `INSERT INTO bulk_upload_batches (user_id, practice_id, file_name, status)
     VALUES ($1, $2, $3, 'processing') RETURNING *`,
    [userId, practiceId, file.originalname]
  );
  
  const results: any[] = [];
  let successful = 0;
  let failed = 0;
  
  const stream = Readable.from(file.buffer.toString());
  
  await new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on('data', async (row) => {
        results.push(row);
      })
      .on('end', async () => {
        for (const row of results) {
          try {
            await db.query(
              `INSERT INTO claims (
                practice_id, created_by, patient_name, patient_dob, insurance_company,
                policy_number, claim_number, procedure_codes, denial_reason, service_date,
                amount_claimed, amount_denied, status
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'draft')`,
              [
                practiceId, userId,
                row.patient_name || row.PatientName,
                parseDate(row.patient_dob || row.DOB),
                row.insurance_company || row.InsuranceCompany,
                row.policy_number || row.PolicyNumber,
                row.claim_number || row.ClaimNumber,
                (row.procedure_codes || row.ProcedureCodes || '').split(','),
                row.denial_reason || row.DenialReason,
                parseDate(row.service_date || row.ServiceDate),
                parseFloat(row.amount_claimed) || 0,
                parseFloat(row.amount_denied) || 0
              ]
            );
            successful++;
          } catch (err) {
            failed++;
            console.error('Bulk insert error:', err);
          }
          
          await db.query(
            `UPDATE bulk_upload_batches 
             SET processed_records = $1, successful_records = $2, failed_records = $3 
             WHERE id = $4`,
            [results.length, successful, failed, batch.id]
          );
        }
        
        await db.query(
          `UPDATE bulk_upload_batches SET status = 'completed', completed_at = NOW() WHERE id = $1`,
          [batch.id]
        );
        resolve(results);
      })
      .on('error', reject);
  });
  
  res.json({ batchId: batch.id, successful, failed, total: results.length });
});

export default router;
