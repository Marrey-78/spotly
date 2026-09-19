import { useState } from 'react';
import flodeLogo from '../../assets/flode-bianco-trasparente.png';
import {Eye,EyeOff,Lock, Mail, User, ArrowRight, MapPin, CalendarDays, Users,} from 'lucide-react';

import {
  loginUser,
  registerUser,
  loginWithFirebase,
} from '../api/auth';

import {
  auth,
  googleProvider,
  facebookProvider,
  signInWithPopup,
} from '../../firebase';


interface LoginViewProps {
  onLogin: (user: any) => void;
}


export function LoginView({ onLogin }: LoginViewProps) {

  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [hasVenue, setHasVenue] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');


  /*
  ============================================================
  LOGIN EMAIL / PASSWORD
  ============================================================
  */

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      const result = await loginUser({
        email,
        password,
      });

      localStorage.setItem(
        'token',
        result.token
      );

      localStorage.setItem(
        'userData',
        JSON.stringify(result.user)
      );

      onLogin(result.user);

    } catch (error) {

      console.error(
        'Errore login:',
        error
      );

      setError(
        'Email o password non corretti.'
      );

    } finally {

      setLoading(false);

    }
  };


  /*
  ============================================================
  REGISTRAZIONE
  ============================================================
  */

  const handleRegister = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      const result = await registerUser({
        name,
        email,
        password,
        hasVenue,
      });

      localStorage.setItem(
        'token',
        result.token
      );

      localStorage.setItem(
        'userData',
        JSON.stringify(result.user)
      );

      onLogin(result.user);

    } catch (error) {

      console.error(
        'Errore registrazione:',
        error
      );

      setError(
        'Non è stato possibile creare il tuo account.'
      );

    } finally {

      setLoading(false);

    }
  };


  /*
  ============================================================
  GOOGLE
  ============================================================
  */

  const handleGoogleLogin = async () => {

    setError('');
    setLoading(true);

    try {

      const result =
        await signInWithPopup(
          auth,
          googleProvider
        );

      const idToken =
        await result.user.getIdToken();

      const backendResult =
        await loginWithFirebase(
          idToken
        );

      localStorage.setItem(
        'token',
        backendResult.token
      );

      localStorage.setItem(
        'userData',
        JSON.stringify(
          backendResult.user
        )
      );

      onLogin(
        backendResult.user
      );

    } catch (error) {

      console.error(
        'Errore login Google:',
        error
      );

      setError(
        'Accesso con Google non riuscito.'
      );

    } finally {

      setLoading(false);

    }
  };


  /*
  ============================================================
  FACEBOOK
  ============================================================
  */

  const handleFacebookLogin = async () => {

    setError('');
    setLoading(true);

    try {

      const result =
        await signInWithPopup(
          auth,
          facebookProvider
        );

      const idToken =
        await result.user.getIdToken();

      const backendResult =
        await loginWithFirebase(
          idToken
        );

      localStorage.setItem(
        'token',
        backendResult.token
      );

      localStorage.setItem(
        'userData',
        JSON.stringify(
          backendResult.user
        )
      );

      onLogin(
        backendResult.user
      );

    } catch (error) {

      console.error(
        'Errore login Facebook:',
        error
      );

      setError(
        'Accesso con Facebook non riuscito.'
      );

    } finally {

      setLoading(false);

    }
  };


  /*
  ============================================================
  UI
  ============================================================
  */

  return (

    <div
      className="
        min-h-screen
        bg-[#050914]
        text-white
        relative
        overflow-x-hidden
      "
    >

      {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}

      <div
        className="
          fixed
          -left-48
          top-1/3
          w-[500px]
          h-[500px]
          bg-cyan-500/10
          rounded-full
          blur-[150px]
          pointer-events-none
        "
      />

      <div
        className="
          fixed
          -right-48
          top-1/4
          w-[500px]
          h-[500px]
          bg-purple-600/15
          rounded-full
          blur-[150px]
          pointer-events-none
        "
      />


      <div
        className="
          min-h-screen
          lg:grid
          lg:grid-cols-[1.05fr_0.95fr]
        "
      >

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <section
          className="
            relative
            hidden
            lg:flex
            min-h-screen
            overflow-hidden
          "
        >

          {/* Background image */}

          <div
            className="
              absolute
              inset-0
              bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=85')]
              bg-cover
              bg-center
            "
          />

          {/* Image overlays */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-[#050914]
              via-[#050914]/40
              to-[#050914]/20
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-transparent
              via-transparent
              to-[#050914]
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-purple-900/10
            "
          />


          {/* LEFT CONTENT */}

          <div
            className="
              relative
              z-10
              flex
              flex-col
              justify-between
              w-full
              px-12
              xl:px-20
              py-12
            "
          >

            {/* LOGO */}

            <FlodeLogo />


            {/* HERO */}

            <div
              className="
                max-w-xl
                pb-14
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-6
                  text-cyan-300
                  text-sm
                  tracking-[0.22em]
                  uppercase
                "
              >
                <span
                  className="
                    w-8
                    h-[1px]
                    bg-cyan-400
                  "
                />

                La città intorno a te
              </div>


              <h1
                className="
                  text-5xl
                  xl:text-6xl
                  font-bold
                  leading-[1.05]
                  tracking-tight
                "
              >
                La tua città,
                <br />

                <span
                  className="
                    bg-gradient-to-r
                    from-cyan-300
                    via-blue-400
                    to-purple-400
                    bg-clip-text
                    text-transparent
                  "
                >
                  in un flusso.
                </span>
              </h1>


              <p
                className="
                  mt-6
                  text-lg
                  text-white/70
                  max-w-lg
                  leading-relaxed
                "
              >
                Scopri eventi, locali e persone.
                Vivi quello che succede intorno a te.
              </p>


              <div
                className="
                  flex
                  gap-8
                  mt-10
                  text-sm
                  text-white/70
                "
              >

                <HeroFeature
                  icon={
                    <MapPin size={18} />
                  }
                  text="Luoghi"
                />

                <HeroFeature
                  icon={
                    <CalendarDays size={18} />
                  }
                  text="Eventi"
                />

                <HeroFeature
                  icon={
                    <Users size={18} />
                  }
                  text="Community"
                />

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <section
          className="
            min-h-screen
            flex
            items-center
            justify-center
            px-5
            sm:px-8
            py-10
            relative
          "
        >

          <div
            className="
              w-full
              max-w-[460px]
            "
          >

            {/* MOBILE LOGO */}

            <div
              className="
                lg:hidden
                flex
                justify-center
                mb-8
              "
            >

              <FlodeLogo
                centered
              />

            </div>


            {/* =================================================
                CARD
            ================================================== */}

            <div
              className="
                bg-[#0B1220]/80
                backdrop-blur-2xl
                border
                border-white/[0.08]
                shadow-2xl
                shadow-black/30
                rounded-[28px]
                p-5
                sm:p-8
              "
            >

              {/* TITLE */}

              <div
                className="
                  mb-7
                "
              >

                <h2
                  className="
                    text-2xl
                    sm:text-3xl
                    font-semibold
                    tracking-tight
                  "
                >
                  {isRegistering
                    ? 'Crea il tuo account'
                    : 'Bentornato'}
                </h2>


                <p
                  className="
                    text-white/45
                    mt-2
                    text-sm
                  "
                >
                  {isRegistering
                    ? 'Entra nel flusso della tua città.'
                    : 'Scopri cosa sta succedendo intorno a te.'}
                </p>

              </div>


              {/* =================================================
                  LOGIN / REGISTER SWITCH
              ================================================== */}

              <div
                className="
                  grid
                  grid-cols-2
                  bg-white/[0.04]
                  border
                  border-white/[0.05]
                  rounded-xl
                  p-1
                  mb-7
                "
              >

                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setError('');
                  }}
                  className={`
                    h-11
                    rounded-lg
                    text-sm
                    font-medium
                    transition-all
                    ${
                      !isRegistering
                        ? `
                          bg-white/[0.10]
                          text-white
                          shadow
                        `
                        : `
                          text-white/45
                          hover:text-white
                        `
                    }
                  `}
                >
                  Accedi
                </button>


                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setError('');
                  }}
                  className={`
                    h-11
                    rounded-lg
                    text-sm
                    font-medium
                    transition-all
                    ${
                      isRegistering
                        ? `
                          bg-white/[0.10]
                          text-white
                          shadow
                        `
                        : `
                          text-white/45
                          hover:text-white
                        `
                    }
                  `}
                >
                  Registrati
                </button>

              </div>


              {/* =================================================
                  FORM
              ================================================== */}

              <form
                onSubmit={
                  isRegistering
                    ? handleRegister
                    : handleLogin
                }
              >

                <div
                  className="
                    space-y-4
                  "
                >

                  {/* NAME */}

                  {isRegistering && (

                    <InputContainer>

                      <User
                        size={19}
                        className="
                          text-white/40
                          shrink-0
                        "
                      />

                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          setName(
                            e.target.value
                          )
                        }
                        placeholder="Nome"
                        required
                        autoComplete="name"
                        className="
                          w-full
                          bg-transparent
                          outline-none
                          text-white
                          placeholder:text-white/30
                        "
                      />

                    </InputContainer>

                  )}


                  {/* EMAIL */}

                  <InputContainer>

                    <Mail
                      size={19}
                      className="
                        text-white/40
                        shrink-0
                      "
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="Email"
                      required
                      autoComplete="email"
                      className="
                        w-full
                        bg-transparent
                        outline-none
                        text-white
                        placeholder:text-white/30
                      "
                    />

                  </InputContainer>


                  {/* PASSWORD */}

                  <InputContainer>

                    <Lock
                      size={19}
                      className="
                        text-white/40
                        shrink-0
                      "
                    />

                    <input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      placeholder="Password"
                      required
                      autoComplete={
                        isRegistering
                          ? 'new-password'
                          : 'current-password'
                      }
                      className="
                        w-full
                        bg-transparent
                        outline-none
                        text-white
                        placeholder:text-white/30
                      "
                    />


                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="
                        text-white/40
                        hover:text-white
                        transition-colors
                      "
                    >

                      {showPassword
                        ? (
                          <EyeOff
                            size={19}
                          />
                        )
                        : (
                          <Eye
                            size={19}
                          />
                        )
                      }

                    </button>

                  </InputContainer>


                  {/* VENUE OWNER */}

                  {isRegistering && (

                    <label
                      className="
                        flex
                        items-start
                        gap-3
                        cursor-pointer
                        pt-1
                      "
                    >

                      <input
                        type="checkbox"
                        checked={hasVenue}
                        onChange={(e) =>
                          setHasVenue(
                            e.target.checked
                          )
                        }
                        className="
                          mt-1
                          accent-cyan-400
                        "
                      />

                      <div>

                        <p
                          className="
                            text-sm
                            text-white/80
                          "
                        >
                          Gestisco un locale
                        </p>

                        <p
                          className="
                            text-xs
                            text-white/35
                            mt-0.5
                          "
                        >
                          Potrai creare e gestire
                          eventi per il tuo locale.
                        </p>

                      </div>

                    </label>

                  )}

                </div>


                {/* FORGOT PASSWORD */}

                {!isRegistering && (

                  <div
                    className="
                      flex
                      justify-end
                      mt-3
                    "
                  >

                    <button
                      type="button"
                      className="
                        text-xs
                        text-white/45
                        hover:text-cyan-300
                        transition-colors
                      "
                    >
                      Hai dimenticato la password?
                    </button>

                  </div>

                )}


                {/* ERROR */}

                {error && (

                  <div
                    className="
                      mt-4
                      px-4
                      py-3
                      rounded-xl
                      bg-red-500/10
                      border
                      border-red-500/20
                      text-red-300
                      text-sm
                    "
                  >
                    {error}
                  </div>

                )}


                {/* MAIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    w-full
                    h-[54px]
                    mt-6
                    rounded-2xl

                    bg-gradient-to-r
                    from-cyan-400
                    via-blue-500
                    to-purple-600

                    font-semibold
                    text-white

                    flex
                    items-center
                    justify-center
                    gap-2

                    shadow-lg
                    shadow-purple-900/20

                    hover:brightness-110
                    active:scale-[0.99]

                    transition-all

                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >

                  {loading
                    ? 'Attendi...'
                    : isRegistering
                    ? 'Crea account'
                    : 'Accedi'
                  }


                  {!loading && (

                    <ArrowRight
                      size={18}
                      className="
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />

                  )}

                </button>

              </form>


              {/* =================================================
                  DIVIDER
              ================================================== */}

              <div
                className="
                  flex
                  items-center
                  gap-4
                  my-6
                "
              >

                <div
                  className="
                    h-px
                    flex-1
                    bg-white/[0.08]
                  "
                />

                <span
                  className="
                    text-xs
                    text-white/35
                  "
                >
                  oppure
                </span>

                <div
                  className="
                    h-px
                    flex-1
                    bg-white/[0.08]
                  "
                />

              </div>


              {/* =================================================
                  SOCIAL LOGIN
              ================================================== */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                "
              >

                {/* GOOGLE */}

                <button
                  type="button"
                  onClick={
                    handleGoogleLogin
                  }
                  disabled={loading}
                  className="
                    h-12
                    rounded-xl

                    border
                    border-white/[0.09]

                    bg-white/[0.04]

                    flex
                    items-center
                    justify-center
                    gap-2.5

                    text-sm
                    font-medium
                    text-white/80

                    hover:bg-white/[0.08]
                    hover:border-white/[0.15]

                    transition-all

                    disabled:opacity-50
                  "
                >

                  <GoogleIcon />

                  Google

                </button>


                {/* FACEBOOK */}

                <button
                  type="button"
                  onClick={
                    handleFacebookLogin
                  }
                  disabled={loading}
                  className="
                    h-12
                    rounded-xl

                    border
                    border-white/[0.09]

                    bg-white/[0.04]

                    flex
                    items-center
                    justify-center
                    gap-2.5

                    text-sm
                    font-medium
                    text-white/80

                    hover:bg-white/[0.08]
                    hover:border-white/[0.15]

                    transition-all

                    disabled:opacity-50
                  "
                >

                  <FacebookIcon />

                  Facebook

                </button>

              </div>


              {/* FOOTER */}

              <p
                className="
                  text-center
                  text-[11px]
                  leading-relaxed
                  text-white/30
                  mt-7
                "
              >
                Continuando accetti i nostri{' '}

                <button
                  type="button"
                  className="
                    text-cyan-400
                    hover:text-cyan-300
                  "
                >
                  Termini di servizio
                </button>

                {' '}e la{' '}

                <button
                  type="button"
                  className="
                    text-cyan-400
                    hover:text-cyan-300
                  "
                >
                  Privacy Policy
                </button>

              </p>

            </div>

          </div>

        </section>

      </div>

    </div>

  );
}


/*
============================================================
INPUT CONTAINER
============================================================
*/

function InputContainer({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <div
      className="
        h-[54px]
        px-4

        flex
        items-center
        gap-3

        rounded-xl

        bg-white/[0.035]

        border
        border-white/[0.10]

        focus-within:border-cyan-400/50
        focus-within:bg-white/[0.05]

        transition-all
      "
    >
      {children}
    </div>

  );
}


/*
============================================================
HERO FEATURE
============================================================
*/

function HeroFeature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-2
      "
    >

      <span
        className="
          text-cyan-300
        "
      >
        {icon}
      </span>

      {text}

    </div>

  );
}


/*
============================================================
FLÖDE LOGO
============================================================
*/
function FlodeLogo({
  centered = false,
}: {
  centered?: boolean;
}) {
  return (
    <div
      className={`
        flex
        items-center
        ${centered ? 'justify-center' : ''}
      `}
    >
      <img
        src={flodeLogo}
        alt="FLÖDE - Live what's around you"
        className="
          w-auto
          h-[80px]
          sm:h-[90px]
          lg:h-[105px]
          object-contain
        "
      />
    </div>
  );
}


/*
============================================================
GOOGLE ICON
============================================================
*/

function GoogleIcon() {

  return (

    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >

      <path
        fill="#4285F4"
        d="M21.35 12.25c0-.74-.07-1.45-.19-2.13H12v4.03h5.24a4.48 4.48 0 0 1-1.94 2.94v2.61h3.14c1.84-1.69 2.91-4.18 2.91-7.45Z"
      />

      <path
        fill="#34A853"
        d="M12 21.75c2.62 0 4.82-.87 6.43-2.35l-3.14-2.61c-.87.58-1.98.93-3.29.93-2.53 0-4.67-1.71-5.44-4.01H3.32v2.69A9.72 9.72 0 0 0 12 21.75Z"
      />

      <path
        fill="#FBBC05"
        d="M6.56 13.71A5.84 5.84 0 0 1 6.25 12c0-.59.1-1.16.31-1.71V7.6H3.32A9.73 9.73 0 0 0 2.25 12c0 1.57.38 3.06 1.07 4.4l3.24-2.69Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.28c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.82 3.36 14.62 2.25 12 2.25A9.72 9.72 0 0 0 3.32 7.6l3.24 2.69c.77-2.3 2.91-4.01 5.44-4.01Z"
      />

    </svg>

  );
}


/*
============================================================
FACEBOOK ICON
============================================================
*/

function FacebookIcon() {

  return (

    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >

      <path
        fill="#1877F2"
        d="
          M24 12.073
          C24 5.405
          18.627 0
          12 0
          S0 5.405
          0 12.073
          C0 18.1
          4.388 23.094
          10.125 24
          v-8.437
          H7.078
          v-3.49
          h3.047
          V9.413
          c0-3.025
          1.792-4.697
          4.533-4.697
          1.312 0
          2.686.236
          2.686.236
          v2.972
          h-1.513
          c-1.49 0
          -1.956.931
          -1.956 1.887
          v2.262
          h3.328
          l-.532 3.49
          h-2.796
          V24
          C19.612 23.094
          24 18.1
          24 12.073
          Z
        "
      />

    </svg>

  );
}