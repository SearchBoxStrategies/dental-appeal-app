const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:password@localhost:5432/dental_appeals'
});

const sql = `
CREATE TABLE IF NOT EXISTS cdt_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(5) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    full_descriptor TEXT
);

INSERT INTO cdt_codes (code, category, description, full_descriptor) VALUES
('D2740', 'Restorative', 'Crown - Porcelain/Ceramic', 'Crown - porcelain/ceramic substrate'),
('D2750', 'Restorative', 'Crown - Porcelain Fused to Metal', 'Crown - porcelain fused to high noble metal'),
('D2751', 'Restorative', 'Crown - Base Metal', 'Crown - porcelain fused to predominantly base metal'),
('D2941', 'Restorative', 'Interim Restoration', 'Interim therapeutic restoration'),
('D0120', 'Diagnostic', 'Periodic Oral Exam', 'Periodic oral evaluation - established patient'),
('D0140', 'Diagnostic', 'Limited Oral Exam', 'Limited oral evaluation - problem focused'),
('D0210', 'Diagnostic', 'Complete X-rays', 'Complete series of radiographic images'),
('D0220', 'Diagnostic', 'Periapical X-ray', 'Intraoral - periapical first image'),
('D0270', 'Diagnostic', 'Bitewing X-ray', 'Bitewing - single radiographic image'),
('D0330', 'Diagnostic', 'Panoramic X-ray', 'Panoramic radiographic image'),
('D3310', 'Endodontic', 'Anterior Root Canal', 'Endodontic therapy - anterior tooth'),
('D3320', 'Endodontic', 'Bicuspid Root Canal', 'Endodontic therapy - bicuspid tooth'),
('D3330', 'Endodontic', 'Molar Root Canal', 'Endodontic therapy - molar tooth'),
('D4341', 'Periodontic', 'Periodontal Scaling', 'Periodontal scaling and root planing - per quadrant'),
('D4355', 'Periodontic', 'Full Mouth Debridement', 'Full mouth debridement to enable comprehensive evaluation'),
('D5110', 'Prosthodontic', 'Complete Denture - Upper', 'Complete denture - maxillary'),
('D5120', 'Prosthodontic', 'Complete Denture - Lower', 'Complete denture - mandibular'),
('D5211', 'Prosthodontic', 'Partial Denture - Upper', 'Partial denture - maxillary'),
('D5212', 'Prosthodontic', 'Partial Denture - Lower', 'Partial denture - mandibular'),
('D6010', 'Implant', 'Surgical Placement', 'Surgical placement of implant body'),
('D6056', 'Implant', 'Prefabricated Abutment', 'Prefabricated abutment'),
('D7210', 'Oral Surgery', 'Extraction - Surgical', 'Surgical extraction of erupted tooth'),
('D7140', 'Oral Surgery', 'Extraction - Simple', 'Extraction, erupted tooth'),
('D7240', 'Oral Surgery', 'Extraction - Impacted', 'Extraction of impacted tooth - partially bony'),
('D1110', 'Preventive', 'Prophylaxis - Adult', 'Dental prophylaxis - adult'),
('D1120', 'Preventive', 'Prophylaxis - Child', 'Dental prophylaxis - child'),
('D1206', 'Preventive', 'Topical Fluoride', 'Topical application of fluoride varnish'),
('D1351', 'Preventive', 'Sealant - Per Tooth', 'Sealant per tooth'),
('D9110', 'Emergency', 'Palliative Treatment', 'Palliative emergency treatment'),
('D8080', 'Orthodontic', 'Comprehensive Treatment', 'Comprehensive orthodontic treatment'),
('D8090', 'Orthodontic', 'Interceptive Treatment', 'Interceptive orthodontic treatment'),
('D8670', 'Orthodontic', 'Periodic Visit', 'Periodic orthodontic treatment visit')
ON CONFLICT (code) DO NOTHING;
`;

async function run() {
    try {
        await client.connect();
        await client.query(sql);
        console.log('CDT codes table created and populated successfully!');
        
        // Verify
        const result = await client.query('SELECT COUNT(*) FROM cdt_codes');
        console.log(`Total codes in database: ${result.rows[0].count}`);
        
        await client.end();
    } catch (err) {
        console.error('Error:', err.message);
        await client.end();
    }
}

run();