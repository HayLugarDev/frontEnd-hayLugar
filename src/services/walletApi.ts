// src/services/walletApi.ts
import api from './apiService'

export const WalletApi = {
  summary(userId: number) {
    return api.get(`/wallet/${userId}/summary`)
  },
  listPayoutAccounts() {
    return api.get(`/payout-accounts/mine`)
  },
  requestWithdrawal(payload: { amount: number; payout_account_id: number|null; note?: string }) {
    return api.post(`/withdrawals`, payload)
  },
  myWithdrawals(params?: any) {
    return api.get(`/withdrawals`, { params })
  }
}
