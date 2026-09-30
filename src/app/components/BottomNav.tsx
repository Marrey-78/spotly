import { Map, List, User, Store, Shield } from 'lucide-react';

export type NavSection =
  | 'home'
  | 'events'
  | 'venues'
  | 'admin'
  | 'profile';

interface BottomNavProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
  isVenueOwner?: boolean;
  isAdmin?: boolean;
}

export function BottomNav({
  activeSection,
  onSectionChange,
  isVenueOwner = false,
  isAdmin = false,
}: BottomNavProps) {
  const navItems = [
    {
      id: 'events' as NavSection,
      label: 'Eventi',
      icon: List,
      show: true,
    },
    {
      id: 'home' as NavSection,
      label: 'Home',
      icon: Map,
      show: true,
    },
    {
      id: 'venues' as NavSection,
      label: 'Locali',
      icon: Store,
      show: isVenueOwner,
    },
    {
      id: 'admin' as NavSection,
      label: 'Admin',
      icon: Shield,
      show: isAdmin,
    },
    {
      id: 'profile' as NavSection,
      label: 'Profilo',
      icon: User,
      show: true,
    },
  ];

 return (
  <nav
    className="
      fixed bottom-0 left-0 right-0
      bg-[#050914]/95
      backdrop-blur-xl
      border-t border-white/10
      safe-area-inset-bottom
      z-50
      shadow-[0_-8px_30px_rgba(0,0,0,0.25)]
    "
  >
    <div className="flex justify-around items-center h-16 px-2">
      {navItems
        .filter((item) => item.show)
        .map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                relative
                flex flex-col items-center justify-center
                gap-1 flex-1 h-full
                transition-all duration-300
                ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }
              `}
            >
              <div
                className={`
                  relative p-2 rounded-xl
                  transition-all duration-300
                  ${
                    isActive
                      ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_18px_rgba(34,211,238,0.30)]'
                      : ''
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive
                      ? 'stroke-[2.5] text-white'
                      : 'stroke-2'
                  }`}
                />
              </div>

              <span
                className={`text-[11px] transition-all duration-300 ${
                  isActive ? 'font-semibold text-white' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
    </div>
  </nav>
);
}