import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Sparkles, Calendar, MapPin, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { loginUser, registerUser , loginWithFirebase} from '../api/auth';
import { auth, googleProvider, signInWithPopup } from '../../firebase';

interface LoginViewProps {
  onLogin: (userData: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'user' | 'venue_owner';
  }) => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    hasVenue: false,

  });


const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const idToken = await result.user.getIdToken();

    const backendResult = await loginWithFirebase(idToken);

    localStorage.setItem('token', backendResult.token);
    localStorage.setItem(
      'userData',
      JSON.stringify(backendResult.user)
    );

    onLogin(backendResult.user);

  } catch (error) {
    console.error('Errore login Google:', error);
    alert('Accesso con Google non riuscito');
  }
};


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (isLogin) {
      const result = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', result.token);
      localStorage.setItem('userData', JSON.stringify(result.user));

      onLogin(result.user);
    } else {
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        hasVenue: formData.hasVenue,
      });

      localStorage.setItem('token', result.token);
      localStorage.setItem('userData', JSON.stringify(result.user));

      onLogin(result.user);
    }
  } catch (error) {
    console.error(error);
    alert('Email o password non validi');
  }
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

              {!isLogin && (
                <label className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.hasVenue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hasVenue: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                  Ho uno o più locali e voglio inserire eventi
                </label>
              )}

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

            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 font-medium text-gray-700 shadow-sm"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M21.35 12.27c0-.78-.07-1.53-.2-2.27H12v4.3h5.2a4.44 4.44 0 0 1-1.93 2.91v2.42h3.13c1.83-1.69 2.95-4.18 2.95-7.36z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 21.9c2.62 0 4.82-.87 6.43-2.37l-3.13-2.42c-.87.58-1.98.92-3.3.92-2.53 0-4.68-1.71-5.45-4.01H3.32v2.5A9.71 9.71 0 0 0 12 21.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.55 14.02A5.84 5.84 0 0 1 6.25 12c0-.7.12-1.38.3-2.02V7.48H3.32A9.72 9.72 0 0 0 2.25 12c0 1.57.38 3.05 1.07 4.52l3.23-2.5z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.97c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.82 3.08 14.62 2.1 12 2.1a9.71 9.71 0 0 0-8.68 5.38l3.23 2.5c.77-2.3 2.92-4.01 5.45-4.01z"
                  />
                </svg>
                        
                Continua con Google
              </button>
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
