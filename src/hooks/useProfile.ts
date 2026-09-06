'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as userService from '@/services/user.service';
import { useAuth } from './useAuth';

export function useUpdateProfile() {
  const { setUser } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<{ firstName: string; lastName: string; email: string }>) =>
      userService.updateProfile(input),
    onSuccess: (user) => {
      setUser(user);
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      userService.changePassword(currentPassword, newPassword),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (password: string) => userService.deleteAccount(password),
  });
}
