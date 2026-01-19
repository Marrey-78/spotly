import { Map, List, User } from 'lucide-react';

export type NavSection = 'home' | 'events' | 'profile';

interface BottomNavProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
}

export function BottomNav({ activeSection, onSectionChange }: BottomNavProps) {
  const navItems = [
    { id: 'events' as NavSection, label: 'Eventi', icon: List },
    { id: 'home' as NavSection, label: 'Home', icon: Map },
    { id: 'profile' as NavSection, label: 'Profilo', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}