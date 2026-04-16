'use client'

import {
  ArrowLeftRight,
  Bell,
  CreditCard,
  LayoutDashboard,
  LucideIcon,
  Send,
  UserCircle,
  Users,
} from 'lucide-react'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Footer from './Footer'

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  Send,
  Users,
  Bell,
  UserCircle,
}

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>

        {sidebarLinks.map((item) => {
          const isActive = item.exactMatch
            ? pathname === item.route
            : pathname === item.route || pathname.startsWith(`${item.route}/`);

          const Icon = ICON_MAP[item.icon];

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn('sidebar-link', { 'bg-bank-gradient': isActive })}
            >
              {Icon && (
                <Icon
                  size={20}
                  className={cn('shrink-0 text-gray-700', { 'text-white': isActive })}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              )}
              <p className={cn('sidebar-label', { '!text-white': isActive })}>
                {item.label}
              </p>
            </Link>
          )
        })}
      </nav>

      <Footer user={user} />
    </section>
  )
}

export default Sidebar
