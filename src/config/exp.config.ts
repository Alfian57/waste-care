/**
 * Experience Points (EXP) Configuration
 * 
 * File ini berisi konfigurasi nilai EXP yang diberikan kepada user
 * untuk berbagai aktivitas di aplikasi Waste Care.
 * 
 * Untuk mengubah nilai EXP, cukup edit nilai-nilai di bawah ini.
 */

export const EXP_CONFIG = {
  /**
   * EXP yang diberikan ketika user membuat laporan sampah
   * @default 100
   */
  CREATE_REPORT: 100,

  /**
   * EXP yang diberikan ketika user bergabung dengan campaign
   * @default 100
   */
  JOIN_CAMPAIGN: 100,

  /**
   * EXP yang diberikan ketika user menyelesaikan campaign (opsional untuk future use)
   * @default 150
   */
  COMPLETE_CAMPAIGN: 150,

  /**
   * EXP bonus untuk user yang membuat campaign (opsional untuk future use)
   * @default 200
   */
  CREATE_CAMPAIGN: 200,
} as const;

/**
 * Helper function untuk mendapatkan nilai EXP berdasarkan action type
 */
export type ExpActionType = keyof typeof EXP_CONFIG;

export function getExpForAction(action: ExpActionType): number {
  return EXP_CONFIG[action];
}

/**
 * Deskripsi untuk setiap tipe action EXP (untuk UI)
 */
export const EXP_ACTION_DESCRIPTIONS: Record<ExpActionType, string> = {
  CREATE_REPORT: 'Membuat laporan sampah',
  JOIN_CAMPAIGN: 'Bergabung dengan campaign',
  COMPLETE_CAMPAIGN: 'Menyelesaikan campaign',
  CREATE_CAMPAIGN: 'Membuat campaign',
};
