/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * share-project-modal.tsx
 * Copyright (C) 2025 Nextify Limited
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 */

'use client'

import { Button } from '@libra/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@libra/ui/components/dialog'
import { Input } from '@libra/ui/components/input'
import { Separator } from '@libra/ui/components/separator'
import { toast } from '@libra/ui/components/sonner'
import { Switch } from '@libra/ui/components/switch'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Copy, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import * as m from '@/paraglide/messages'
import { useTRPC } from '@/trpc/client'

interface ShareProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
}

export function ShareProjectModal({ open, onOpenChange, projectId }: ShareProjectModalProps) {
  const [isPublic, setIsPublic] = useState(true)

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  // Query project data to get production deploy URL
  const projectQuery = useQuery(
    trpc.project.getById.queryOptions({ id: projectId }, { enabled: !!projectId && open })
  )

  const projectData = projectQuery.data as
    | { productionDeployUrl?: string; visibility?: 'public' | 'private' }
    | undefined
  const projectUrl = projectData?.productionDeployUrl
  const isProjectDeployed = !!projectUrl

  // Project visibility update mutation
  const updateVisibilityMutation = useMutation(
    trpc.project.updateProjectVisibility.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.project.getById.pathFilter())
        toast.success(m['dashboard.share.modal.states.visibilityUpdateSuccess']())
      },
      onError: (error) => {
        setIsPublic(projectData?.visibility === 'public')
        toast.error(error.message || m['dashboard.share.modal.states.visibilityUpdateFailed']())
      },
    })
  )

  // Initialize isPublic state based on project data
  useEffect(() => {
    if (projectData?.visibility) {
      setIsPublic(projectData.visibility === 'public')
    }
  }, [projectData?.visibility])

  const handleVisibilityChange = (newIsPublic: boolean) => {
    setIsPublic(newIsPublic)
    updateVisibilityMutation.mutate({
      projectId,
      visibility: newIsPublic ? 'public' : 'private',
    })
  }

  const isSwitchDisabled = updateVisibilityMutation.isPending || projectQuery.isLoading

  const copyToClipboard = async () => {
    if (!projectUrl) return
    try {
      await navigator.clipboard.writeText(projectUrl)
      toast.success(m['dashboard.share.modal.states.copy_success']())
    } catch {
      toast.error(m['dashboard.share.modal.states.copy_failed']())
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[90vw] sm:max-w-lg' showCloseButton={false}>
        {/* Close Button - Positioned absolutely */}
        <div className='absolute top-4 right-4 z-10'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onOpenChange(false)}
            className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground transition-colors'
            aria-label={m['dashboard.share.modal.close']()}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>

        {/* Header */}
        <DialogHeader className='space-y-3 pb-6'>
          <DialogTitle className='text-xl font-semibold tracking-tight'>
            {m['dashboard.share.modal.title']()}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground'>
            {isProjectDeployed
              ? m['dashboard.share.modal.description']()
              : m['dashboard.share.modal.description_not_deployed']()}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Project Visibility Toggle */}
          <div className='flex items-center justify-between py-2'>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-foreground'>
                {m['dashboard.share.modal.visibility.title']()}
              </p>
              <p className='text-xs text-muted-foreground'>
                {isPublic
                  ? m['dashboard.share.modal.visibility.description']()
                  : m['dashboard.share.modal.visibility.privateProjectDescription']()}
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={handleVisibilityChange}
              disabled={isSwitchDisabled}
              className='ml-4'
            />
          </div>

          <Separator />

          {/* Copy Link Section */}
          <div className='space-y-3'>
            <div>
              <p className='text-sm font-medium text-foreground mb-1'>
                {m['dashboard.share.modal.copy_link.title']()}
              </p>
              <p className='text-xs text-muted-foreground'>
                {m['dashboard.share.modal.copy_link.description']()}
              </p>
            </div>

            {isProjectDeployed ? (
              <div className='flex items-center gap-2'>
                <Input
                  value={projectUrl}
                  readOnly
                  className='flex-1 bg-muted/50 text-sm font-mono text-muted-foreground border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-ring'
                />
                <Button onClick={copyToClipboard} className='px-4 h-10 shrink-0'>
                  <Copy className='h-4 w-4 mr-2' />
                  {m['dashboard.share.modal.copy_link.copy_button']()}
                </Button>
              </div>
            ) : (
              <div className='flex items-center gap-3 p-4 bg-muted/20 rounded-lg border border-muted-foreground/20'>
                <AlertCircle className='h-4 w-4 text-brand shrink-0' />
                <div className='text-sm text-muted-foreground'>
                  {projectQuery.isLoading
                    ? m['dashboard.share.modal.states.loading']()
                    : m['dashboard.share.modal.states.not_deployed']()}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
