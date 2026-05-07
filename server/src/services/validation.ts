import { db } from '../db';

export interface ValidationResult {
  passed: boolean;
  warnings: string[];
  errors: string[];
  autoFixed: boolean;
}

export const validateClaim = async (claimData: any, claimId?: number): Promise<ValidationResult> => {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // 1. Check for missing documentation
  if (claimData.procedure_codes && claimData.procedure_codes.length > 0) {
    const { rows: documents } = await db.query(
      'SELECT COUNT(*) FROM claim_documents WHERE claim_id = $1',
      [claimId]
    );
    
    if (parseInt(documents[0].count) === 0) {
      warnings.push('No supporting documents attached. X-rays or clinical notes strengthen appeal success.');
    }
  }
  
  // 2. Validate procedure codes are valid
  const validCodes = ['D0120', 'D0140', 'D0210', 'D0220', 'D0270', 'D0330', 
    'D1110', 'D1120', 'D1206', 'D1351', 'D2140', 'D2150', 'D2160', 'D2330', 
    'D2331', 'D2332', 'D2391', 'D2392', 'D2393', 'D2394', 'D2710', 'D2720', 
    'D2740', 'D2750', 'D2751', 'D2780', 'D2781', 'D2790', 'D2791', 'D2792',
    'D2794', 'D2910', 'D2920', 'D2930', 'D2931', 'D2940', 'D2950', 'D2951',
    'D2952', 'D2953', 'D2954', 'D2955', 'D2957', 'D2960', 'D2961', 'D2962',
    'D2980', 'D2999', 'D3110', 'D3120', 'D3220', 'D3221', 'D3230', 'D3240',
    'D3310', 'D3320', 'D3330', 'D3346', 'D3347', 'D3348', 'D3351', 'D3352',
    'D3410', 'D3421', 'D3425', 'D3426', 'D3430', 'D3450', 'D3460', 'D3470',
    'D3910', 'D3920', 'D3950', 'D4210', 'D4211', 'D4240', 'D4241', 'D4245',
    'D4249', 'D4260', 'D4261', 'D4265', 'D4270', 'D4273', 'D4274', 'D4275',
    'D4276', 'D4283', 'D4285', 'D4321', 'D4341', 'D4342', 'D4355', 'D4381',
    'D4910', 'D4920', 'D5110', 'D5120', 'D5130', 'D5140', 'D5211', 'D5212',
    'D5213', 'D5214', 'D5221', 'D5222', 'D5225', 'D5226', 'D5281', 'D5410',
    'D5411', 'D5421', 'D5422', 'D5510', 'D5520', 'D5610', 'D5620', 'D5630',
    'D5640', 'D5650', 'D5660', 'D5670', 'D5671', 'D5720', 'D5721', 'D5730',
    'D5731', 'D5740', 'D5741', 'D5750', 'D5751', 'D5760', 'D5761', 'D5810',
    'D5811', 'D5820', 'D5821', 'D5850', 'D5851', 'D5860', 'D5861', 'D5862',
    'D5863', 'D5864', 'D5865', 'D5866', 'D5867', 'D5899', 'D5911', 'D5912',
    'D5913', 'D5914', 'D5915', 'D5919', 'D5922', 'D5923', 'D5924', 'D5925',
    'D5926', 'D5927', 'D5928', 'D5929', 'D5931', 'D5932', 'D5933', 'D5934',
    'D5935', 'D5936', 'D5937', 'D5940', 'D5951', 'D5952', 'D5953', 'D5954',
    'D5955', 'D5958', 'D5959', 'D5960', 'D5982', 'D5983', 'D5984', 'D5985',
    'D5986', 'D5987', 'D5988', 'D5999', 'D6010', 'D6011', 'D6012', 'D6013',
    'D6040', 'D6050', 'D6051', 'D6052', 'D6053', 'D6054', 'D6055', 'D6056',
    'D6057', 'D6058', 'D6059', 'D6060', 'D6061', 'D6062', 'D6063', 'D6064',
    'D6065', 'D6066', 'D6067', 'D6068', 'D6069', 'D6070', 'D6071', 'D6072',
    'D6073', 'D6074', 'D6075', 'D6076', 'D6077', 'D6080', 'D6081', 'D6090',
    'D6091', 'D6092', 'D6093', 'D6094', 'D6095', 'D6096', 'D6097', 'D6100',
    'D6110', 'D6111', 'D6112', 'D6113', 'D6114', 'D6115', 'D6116', 'D6117',
    'D6190', 'D6191', 'D6194', 'D6199', 'D6210', 'D6211', 'D6212', 'D6240',
    'D6241', 'D6242', 'D6245', 'D6250', 'D6251', 'D6252', 'D6253', 'D6254',
    'D6255', 'D6299', 'D6545', 'D6548', 'D6549', 'D6610', 'D6611', 'D6612',
    'D6620', 'D6630', 'D6631', 'D6632', 'D6633', 'D6634', 'D6640', 'D6710',
    'D6720', 'D6721', 'D6722', 'D6730', 'D6740', 'D6750', 'D6751', 'D6752',
    'D6780', 'D6781', 'D6782', 'D6783', 'D6790', 'D6791', 'D6792', 'D6793',
    'D6810', 'D6820', 'D6920', 'D6930', 'D6940', 'D6950', 'D6970', 'D6971',
    'D6972', 'D6973', 'D6975', 'D6976', 'D6977', 'D6980', 'D6985', 'D6999',
    'D7111', 'D7140', 'D7210', 'D7220', 'D7230', 'D7240', 'D7241', 'D7250',
    'D7260', 'D7261', 'D7270', 'D7280', 'D7281', 'D7282', 'D7283', 'D7285',
    'D7286', 'D7288', 'D7290', 'D7291', 'D7310', 'D7311', 'D7320', 'D7321',
    'D7340', 'D7350', 'D7410', 'D7411', 'D7412', 'D7413', 'D7414', 'D7415',
    'D7440', 'D7441', 'D7450', 'D7451', 'D7460', 'D7461', 'D7465', 'D7471',
    'D7472', 'D7473', 'D7485', 'D7490', 'D7510', 'D7511', 'D7520', 'D7521',
    'D7530', 'D7540', 'D7550', 'D7560', 'D7610', 'D7620', 'D7630', 'D7640',
    'D7650', 'D7660', 'D7670', 'D7671', 'D7680', 'D7710', 'D7720', 'D7730',
    'D7740', 'D7750', 'D7760', 'D7770', 'D7771', 'D7780', 'D7810', 'D7820',
    'D7830', 'D7840', 'D7850', 'D7851', 'D7852', 'D7853', 'D7854', 'D7855',
    'D7856', 'D7858', 'D7860', 'D7865', 'D7870', 'D7871', 'D7872', 'D7873',
    'D7874', 'D7875', 'D7876', 'D7877', 'D7880', 'D7881', 'D7899', 'D7910',
    'D7911', 'D7912', 'D7920', 'D7921', 'D7922', 'D7930', 'D7931', 'D7932',
    'D7940', 'D7941', 'D7942', 'D7943', 'D7944', 'D7945', 'D7946', 'D7947',
    'D7948', 'D7949', 'D7950', 'D7951', 'D7952', 'D7953', 'D7954', 'D7955',
    'D7956', 'D7957', 'D7960', 'D7961', 'D7962', 'D7963', 'D7970', 'D7971',
    'D7972', 'D7979', 'D7980', 'D7981', 'D7982', 'D7995', 'D7996', 'D7997',
    'D7998', 'D7999', 'D8010', 'D8020', 'D8030', 'D8040', 'D8050', 'D8060',
    'D8070', 'D8080', 'D8090', 'D8210', 'D8220', 'D8660', 'D8670', 'D8680',
    'D8690', 'D8999', 'D9110', 'D9120', 'D9210', 'D9211', 'D9215', 'D9220',
    'D9221', 'D9230', 'D9241', 'D9242', 'D9243', 'D9248', 'D9310', 'D9311',
    'D9320', 'D9321', 'D9322', 'D9323', 'D9324', 'D9330', 'D9340', 'D9350',
    'D9410', 'D9420', 'D9430', 'D9440', 'D9450', 'D9910', 'D9911', 'D9920',
    'D9930', 'D9940', 'D9941', 'D9942', 'D9943', 'D9944', 'D9950', 'D9951',
    'D9952', 'D9960', 'D9961', 'D9970', 'D9971', 'D9972', 'D9973', 'D9974',
    'D9975', 'D9985', 'D9986', 'D9987', 'D9995', 'D9996', 'D9997', 'D9999'];
    
    for (const code of claimData.procedure_codes) {
      if (!validCodes.includes(code)) {
        errors.push(`Procedure code ${code} may not be valid. Verify with insurance provider.`);
      }
    }
  }
  
  // 3. Check for denial reason completeness
  if (!claimData.denial_reason || claimData.denial_reason.length < 20) {
    warnings.push('Denial reason is brief. Adding more detail improves appeal success rates.');
  }
  
  // 4. Check for missing patient information
  if (!claimData.patient_dob) {
    errors.push('Patient date of birth is required for claim validation.');
  }
  
  // 5. Check service date validity
  if (claimData.service_date) {
    const serviceDate = new Date(claimData.service_date);
    const today = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(today.getFullYear() - 2);
    
    if (serviceDate > today) {
      errors.push('Service date cannot be in the future.');
    }
    if (serviceDate < twoYearsAgo) {
      warnings.push('Service date is over 2 years old. Check timely filing limits.');
    }
  }
  
  return {
    passed: errors.length === 0,
    warnings,
    errors,
    autoFixed: false
  };
};

export const getValidationSummary = async (claimId: number) => {
  const { rows } = await db.query(`
    SELECT 
      COUNT(*) as total_checks,
      COUNT(CASE WHEN issue_found THEN 1 END) as issues_found,
      COUNT(CASE WHEN requires_attention THEN 1 END) as needs_attention
    FROM claim_validations 
    WHERE claim_id = $1
  `, [claimId]);
  
  return rows[0];
};
