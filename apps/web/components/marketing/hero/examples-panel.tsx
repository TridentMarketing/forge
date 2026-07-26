/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * examples-panel.tsx
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

import { Calendar, CheckCircle2, Sparkles, UserRound, Wrench } from 'lucide-react'
import { Fragment, type MutableRefObject, type RefObject } from 'react'
import * as m from '@/paraglide/messages'
import type { ExampleCategory } from './types'

interface ExamplesPanelProps {
  examplesRef: RefObject<HTMLDivElement> | MutableRefObject<HTMLDivElement | null>
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  onApplyExample: (example: string) => void
}

/**
 * Define example categories and example data
 */
const getExampleCategories = (): ExampleCategory[] => [
  {
    id: 'guest',
    name: m['hero.examples.guest'](),
    icon: <Calendar className='size-4' />,
    color: 'blue',
    examples: [
      {
        title: m['hero.examples.booking_widget'](),
        description: m['hero.examples.booking_widget_desc'](),
        preview: m['hero.examples.booking_widget_preview'](),
      },
      {
        title: m['hero.examples.activity_schedule'](),
        description: m['hero.examples.activity_schedule_desc'](),
        preview: m['hero.examples.activity_schedule_preview'](),
      },
    ],
  },
  {
    id: 'operations',
    name: m['hero.examples.operations'](),
    icon: <Wrench className='size-4' />,
    color: 'purple',
    examples: [
      {
        title: m['hero.examples.occupancy_dashboard'](),
        description: m['hero.examples.occupancy_dashboard_desc'](),
        preview: m['hero.examples.occupancy_dashboard_preview'](),
      },
      {
        title: m['hero.examples.maintenance_tracker'](),
        description: m['hero.examples.maintenance_tracker_desc'](),
        preview: m['hero.examples.maintenance_tracker_preview'](),
      },
    ],
  },
  {
    id: 'members',
    name: m['hero.examples.members'](),
    icon: <UserRound className='size-4' />,
    color: 'green',
    examples: [
      {
        title: m['hero.examples.member_portal'](),
        description: m['hero.examples.member_portal_desc'](),
        preview: m['hero.examples.member_portal_preview'](),
      },
      {
        title: m['hero.examples.referral_form'](),
        description: m['hero.examples.referral_form_desc'](),
        preview: m['hero.examples.referral_form_preview'](),
      },
    ],
  },
]

/**
 * Get a flat list of all examples (for typewriter effect)
 */
export const getAllExamples = () => {
  return getExampleCategories().flatMap((category) =>
    category.examples.map((example) => example.description)
  )
}

/**
 * Example display panel component.
 * The parent component can control its display timing, which takes precedence over the button component.
 * Avoid using z-index for stacking, use conditional rendering instead.
 */
export const ExamplesPanel = ({
  examplesRef,
  selectedCategory,
  setSelectedCategory,
  onApplyExample,
}: ExamplesPanelProps) => {
  const exampleCategories = getExampleCategories()

  return (
    <div
      ref={examplesRef}
      id='examples-panel'
      className='absolute mt-1 w-full bg-[var(--background-landing)]/95 backdrop-blur-sm ring-1 ring-border/30 rounded-lg shadow-lg overflow-hidden transition-all animate-in fade-in-0 zoom-in-95 duration-200'
      style={{
        position: 'absolute',
        zIndex: 9999, // Set the highest z-index using inline style
      }}
    >
      {/* Title bar */}
      <div className='flex items-center justify-between p-3 border-b border-border/20'>
        <div className='flex items-center gap-1.5'>
          <Sparkles className='size-4 text-primary' />
          <h3 className='font-medium'>{m.hero_examples_title()}</h3>
        </div>
        <p className='text-xs text-muted-foreground'>{m.hero_examples_subtitle()}</p>
      </div>

      <div className='p-2'>
        {/* Category navigation */}
        <div className='flex gap-1 mb-3 px-1 overflow-x-auto pb-1 scrollbar-thin'>
          {exampleCategories.map((category) => (
            <button
              type='button'
              key={category.id}
              className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground ring-1 ring-primary/50'
                  : 'hover:bg-muted ring-1 ring-border/20 hover:ring-border/40'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>

        {/* Example card grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[280px] overflow-y-auto p-1 scrollbar-thin'>
          {(selectedCategory === ''
            ? exampleCategories
            : exampleCategories.filter((c) => c.id === selectedCategory)
          ).map((category) => (
            <Fragment key={category.id}>
              {category.examples.map((example, index) => (
                <button
                  key={`${category.id}-${index}`}
                  type='button'
                  className='flex flex-col text-left p-3 rounded-md bg-muted/30 hover:bg-muted/60 ring-1 ring-border/20 hover:ring-border/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
                  onClick={() => onApplyExample(example.description)}
                >
                  <div className='flex items-center justify-between gap-2 mb-1'>
                    <span className='font-medium text-sm'>{example.title}</span>
                    <span className='inline-flex items-center justify-center size-5 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20'>
                      {category.icon}
                    </span>
                  </div>
                  <p className='text-xs text-muted-foreground line-clamp-2'>
                    {example.description}
                  </p>
                  <div className='flex items-center mt-2 text-primary text-xs font-medium'>
                    <CheckCircle2 className='size-3 mr-1' />
                    {example.preview}
                  </div>
                </button>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
