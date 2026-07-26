/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * app-sidebar.tsx
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

import { authClient } from '@libra/auth/auth-client'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@libra/ui/components/sidebar'
import {
  HelpCircleIcon,
  HomeIcon,
  LayoutDashboardIcon,
  MonitorSmartphoneIcon,
  PlugIcon,
  ShieldIcon,
  UsersIcon,
} from 'lucide-react'
import type * as React from 'react'
import { siteConfig } from '@/configs/site'
import * as m from '@/paraglide/messages'
import Github from '../logos/github'
import { NavMain } from './nav-main'
import { NavSecondary } from './nav-secondary'
import { NavUser } from './nav-user'
import { WorkspaceSwitcher } from './workspace-switch'

// Create a WorkspaceSkeleton component
const WorkspaceSkeleton = () => {
  return (
    <div className='p-4'>
      <div className='flex items-center space-x-2'>
        {/* Skeleton - avatar placeholder */}
        <div className='w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse' />
        <div className='flex-1'>
          {/* Skeleton - workspace name placeholder */}
          <div className='h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
          {/* Skeleton - plan name placeholder */}
          <div className='h-3 w-12 bg-gray-100 dark:bg-gray-800 rounded mt-1 animate-pulse' />
        </div>
        {/* Skeleton - dropdown button placeholder */}
        <div className='w-5 h-5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse' />
      </div>
    </div>
  )
}

// Define organization type based on database schema
interface Organization {
  id: string
  name: string
  slug?: string | null
  logo?: string | null
  createdAt: Date
  metadata?: string | null
}

// Define user data structure
interface UserData {
  id: string
  name: string
  email: string
  image?: string | null
  activeOrganizationId?: string

  [key: string]: any
}

// Define workspace interface data structure
interface ProcessedWorkspace {
  id: string
  name: string
  logo: React.ElementType
  plan: string
  slug?: string
}

const getNavMainItems = (userRole?: string) => {
  const items = [
    {
      title: m['dashboard.sidebar.navigation.dashboard'](),
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: m['dashboard.sidebar.navigation.teams'](),
      url: '/dashboard/teams',
      icon: UsersIcon,
    },
    {
      title: m['dashboard.sidebar.navigation.session'](),
      url: '/dashboard/session',
      icon: MonitorSmartphoneIcon,
    },
    {
      title: m['dashboard.sidebar.navigation.integrations'](),
      url: '/dashboard/integrations',
      icon: PlugIcon,
    },
  ]

  // Add Admin navigation item for admin and superadmin users
  if (userRole === 'admin' || userRole === 'superadmin') {
    items.unshift({
      title: m['dashboard.sidebar.navigation.admin'](),
      url: '/dashboard/admin',
      icon: ShieldIcon,
    })
  }

  return items
}

const getNavSecondaryItems = () => [
  {
    title: m['dashboard.sidebar.navigation.github'](),
    url: siteConfig.links.github,
    icon: Github,
  },
  {
    title: m['dashboard.sidebar.navigation.support'](),
    url: siteConfig.links.email,
    icon: HelpCircleIcon,
  },
]

export function AppSidebar({
  userData,
  ...props
}: {
  userData: UserData
} & React.ComponentProps<typeof Sidebar>) {
  // Get user session for admin permission check
  const { data: session } = authClient.useSession()

  // Use authClient to get organization list - add isPending state
  const { data: organizations = [], isPending: organizationsPending } =
    // @ts-expect-error
    authClient.useListOrganizations()
  // @ts-expect-error
  const { data: activeOrganization } = authClient.useActiveOrganization()

  const isLoading = organizationsPending

  // Extract username from email (part before the @ symbol)
  const extractUsernameFromEmail = (email: string): string => {
    if (!email || email.trim() === '') return ''
    // Get the content before the @ symbol as the username
    const username = email.split('@')[0]
    // If extraction is successful and not empty, return that username, otherwise return empty string
    return username || ''
  }

  // Process user data
  const processedUserData = {
    name: userData.name || extractUsernameFromEmail(userData.email) || 'Guest',
    email: userData.email || 'No email',
    avatar: userData.image || '/avatars/default.jpg',
    status: 'online' as const,
    notificationCount: 0,
  }

  // Process workspace data — Forge is internal, all workspaces are equal
  const workspaces: ProcessedWorkspace[] = (organizations || []).map(
    (organization: { id: string; name: any; slug: any }) => ({
      id: organization.id,
      name: organization.name,
      logo: HomeIcon,
      plan: 'INTERNAL',
      slug: organization.slug || undefined,
    })
  )

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        {isLoading ? <WorkspaceSkeleton /> : <WorkspaceSwitcher teams={workspaces} />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getNavMainItems(session?.user?.role ?? undefined)} />
        <NavSecondary items={getNavSecondaryItems()} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={processedUserData} />
      </SidebarFooter>
    </Sidebar>
  )
}
