'use client';

import React, { useEffect, useState } from 'react';
import { leaderboardService, LeaderboardEntry } from '@/lib/leaderboardService';
import { useAuth } from '@/hooks/useAuth';
import { BottomNavigation } from '@/components/shared/BottomNavigation';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<{ rank: number; exp: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchLeaderboard = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch top 100 users
      const data = await leaderboardService.getLeaderboard(100);
      setLeaderboard(data);

      // Fetch current user's rank if logged in
      if (user) {
        const rank = await leaderboardService.getUserRank(user.id);
        setUserRank(rank);
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Gagal memuat leaderboard');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
    return 'bg-gray-100 text-gray-700';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-24">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white pt-safe">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">🏆 Leaderboard</h1>
          <p className="text-emerald-100">Ranking pengguna berdasarkan EXP</p>
        </div>
      </div>

      {/* User's Rank Card */}
      {user && userRank && (
        <div className="px-6 -mt-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${getRankBadgeColor(userRank.rank)}`}>
                  {getRankIcon(userRank.rank) || `#${userRank.rank}`}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Peringkat Anda</p>
                  <p className="text-2xl font-bold text-gray-900">#{userRank.rank}</p>
                  <p className="text-sm text-gray-600">dari {userRank.total} pengguna</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total EXP</p>
                <p className="text-3xl font-bold text-emerald-600">{userRank.exp.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="px-6 mb-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="px-6">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Belum ada data leaderboard</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {leaderboard.map((entry, index) => {
                const isCurrentUser = user?.id === entry.id;
                const isTopThree = entry.rank <= 3;

                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-4 transition-colors ${
                      isCurrentUser 
                        ? 'bg-emerald-50 hover:bg-emerald-100' 
                        : isTopThree 
                        ? 'bg-gradient-to-r from-amber-50 to-transparent hover:from-amber-100' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${getRankBadgeColor(entry.rank)}`}>
                        {getRankIcon(entry.rank) || `#${entry.rank}`}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate ${isCurrentUser ? 'text-emerald-700' : 'text-gray-900'}`}>
                          {entry.displayName}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">
                              Anda
                            </span>
                          )}
                        </p>
                        {entry.email && (
                          <p className="text-sm text-gray-500 truncate">{entry.email}</p>
                        )}
                      </div>

                      {/* EXP */}
                      <div className="text-right">
                        <p className={`text-lg font-bold ${isTopThree ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {entry.exp.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">EXP</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-6 mb-4 text-center text-sm text-gray-500">
          <p>💡 Kumpulkan EXP dengan melaporkan sampah dan ikut campaign!</p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
