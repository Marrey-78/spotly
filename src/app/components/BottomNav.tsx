import { Map, List, User, Store } from 'lucide-react';

export type NavSection = 'home' | 'events' | 'venues' | 'profile';

interface BottomNavProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
  isVenueOwner?: boolean;
}

export function BottomNav({ activeSection, onSectionChange, isVenueOwner = false }: BottomNavProps) {
  const navItems = [
    { id: 'events' as NavSection, label: 'Eventi', icon: List, show: true },
    { id: 'home' as NavSection, label: 'Home', icon: Map, show: true },
    { id: 'venues' as NavSection, label: 'Locali', icon: Store, show: isVenueOwner },
    { id: 'profile' as NavSection, label: 'Profilo', icon: User, show: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50">
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
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 ${
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-all ${
                    isActive ? 'bg-indigo-50' : ''
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? 'stroke-[2.5]' : 'stroke-2'
                    }`}
                  />
                </div>

                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
      </div>
    </nav>
  );
}
