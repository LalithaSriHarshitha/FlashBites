'use client';
import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';
import {
  Ripple,
  AuthTabs,
  TechOrbitDisplay,
} from '../ui/modern-animated-sign-in';
import { ShoppingBag, Utensils, Bike } from 'lucide-react';

type FormData = {
  email: string;
  password: string;
};

interface OrbitIcon {
  component: () => ReactNode;
  className: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
}

const iconsArray: OrbitIcon[] = [
  {
    component: () => (
      <img
        width={30}
        height={30}
        src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg'
        alt='HTML5'
      />
    ),
    className: 'size-[30px] border-none bg-transparent',
    duration: 20,
    delay: 20,
    radius: 90,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <img
        width={30}
        height={30}
        src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg'
        alt='CSS3'
      />
    ),
    className: 'size-[30px] border-none bg-transparent',
    duration: 20,
    delay: 10,
    radius: 90,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <img
        width={35}
        height={35}
        src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg'
        alt='TypeScript'
      />
    ),
    className: 'size-[35px] border-none bg-transparent',
    radius: 160,
    duration: 20,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <img
        width={35}
        height={35}
        src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg'
        alt='TailwindCSS'
      />
    ),
    className: 'size-[35px] border-none bg-transparent',
    duration: 20,
    delay: 20,
    radius: 130,
    path: false,
    reverse: true,
  },
  {
    component: () => (
      <img
        width={35}
        height={35}
        src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg'
        alt='React'
      />
    ),
    className: 'size-[35px] border-none bg-transparent',
    radius: 210,
    duration: 20,
    path: false,
    reverse: true,
  },
];

export function AuthDemo({ onLoginSuccess }: { onLoginSuccess?: (user: { name: string; email: string; role: 'CUSTOMER' | 'RESTAURANT' | 'DRIVER' }) => void }) {
  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'RESTAURANT' | 'DRIVER'>('CUSTOMER');
  const [formData, setFormData] = useState<FormData>({
    email: selectedRole === 'CUSTOMER' ? 'customer@flashbites.com' : selectedRole === 'RESTAURANT' ? 'restaurant@flashbites.com' : 'driver@flashbites.com',
    password: '',
  });

  const handleRoleChange = (role: 'CUSTOMER' | 'RESTAURANT' | 'DRIVER') => {
    setSelectedRole(role);
    const defaultEmail = role === 'CUSTOMER' ? 'customer@flashbites.com' : role === 'RESTAURANT' ? 'restaurant@flashbites.com' : 'driver@flashbites.com';
    setFormData((prev) => ({ ...prev, email: defaultEmail }));
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    name: keyof FormData
  ) => {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onLoginSuccess) {
      const names = {
        CUSTOMER: 'Alex Rivera',
        RESTAURANT: 'Campus Burger Hub',
        DRIVER: 'Marcus Chen'
      };
      onLoginSuccess({
        name: names[selectedRole],
        email: formData.email || `${selectedRole.toLowerCase()}@flashbites.com`,
        role: selectedRole
      });
    }
  };

  const roleTitles = {
    CUSTOMER: 'User / Customer Login',
    RESTAURANT: 'Restaurant Partner Login',
    DRIVER: 'Delivery Partner Login'
  };

  const formFields = {
    header: roleTitles[selectedRole],
    subHeader: 'Enter credentials to log into your secured account dashboard',
    fields: [
      {
        label: 'Email',
        required: true,
        type: 'email',
        placeholder: `Enter ${selectedRole.toLowerCase()} email`,
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, 'email'),
      },
      {
        label: 'Password',
        required: true,
        type: 'password',
        placeholder: 'Enter password',
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, 'password'),
      },
    ],
    submitButton: `Log In as ${selectedRole}`,
    textVariantButton: 'Forgot password?',
  };

  return (
    <section className='flex max-lg:justify-center w-full min-h-[520px] bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50 my-6'>
      {/* Left Side */}
      <span className='flex flex-col justify-center w-1/2 max-lg:hidden relative p-8 bg-slate-50 border-r border-slate-200'>
        <Ripple mainCircleSize={90} />
        <TechOrbitDisplay iconsArray={iconsArray} text="FlashBites" />
      </span>

      {/* Right Side */}
      <span className='w-1/2 flex flex-col justify-center items-center max-lg:w-full max-lg:px-[10%] p-8 bg-white'>
        
        {/* Role Selector Tabs */}
        <div className="w-full max-w-sm mb-6">
          <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
            Select Portal Role:
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleRoleChange('CUSTOMER')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'CUSTOMER'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4 mb-0.5" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('RESTAURANT')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'RESTAURANT'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-4 h-4 mb-0.5" />
              <span>Restaurant</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('DRIVER')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'DRIVER'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bike className="w-4 h-4 mb-0.5" />
              <span>Driver</span>
            </button>
          </div>
        </div>

        <AuthTabs
          formFields={formFields}
          goTo={(e) => { e.preventDefault(); alert('Reset link sent to registered email.'); }}
          handleSubmit={handleSubmit}
        />
      </span>
    </section>
  );
}
