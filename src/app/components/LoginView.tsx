import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Sparkles, Calendar, MapPin, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LoginViewProps {
  onLogin: (userData: { name: string; email: string; avatar: string }) => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulazione login/registrazione
    const userData = {
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
    };
    
    onLogin(userData);
  };

  const handleQuickLogin = () => {
    // Login rapido con dati demo
    const demoUser = {
      name: 'Marco Rossi',
      email: 'marco.rossi@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    };
    onLogin(demoUser);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Hero section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold">NightLife</h1>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Scopri gli eventi<br />più cool della città
            </h2>
            <p className="text-xl text-white/90 max-w-md">
              Trova concerti, feste, spettacoli e molto altro. La tua notte perfetta ti aspetta.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-semibold">100+ Eventi</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <MapPin className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-semibold">50+ Località</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <Heart className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-semibold">Preferiti</p>
          </div>
        </div>
      </div>

      {/* Right side - Form section */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              NightLife
            </h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Bentornato!' : 'Inizia ora'}
              </h2>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Accedi per scoprire gli eventi della tua città' 
                  : 'Crea un account per salvare i tuoi eventi preferiti'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nome</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Mario Rossi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 h-12 rounded-xl"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="tua@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Password dimenticata?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-base"
              >
                {isLogin ? 'Accedi' : 'Registrati'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">oppure</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleQuickLogin}
                variant="outline"
                className="w-full mt-4 h-12 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
              >
                <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                Prova con account demo
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  {isLogin ? 'Registrati' : 'Accedi'}
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Continuando, accetti i nostri Termini di Servizio e Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
