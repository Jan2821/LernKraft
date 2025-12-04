import React, { useState } from 'react';
import { UserRole } from '../types';
import { storageService } from '../services/storageService';
import { CreditCard, Check, ArrowRight, BookOpen } from 'lucide-react';

interface OnboardingProps {
  onComplete: (username: string) => void;
  onCancel: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    address: '',
    city: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        username: formData.username,
        fullName: `${formData.firstName} ${formData.lastName}`,
        role: UserRole.STUDENT,
        address: `${formData.address}, ${formData.zip} ${formData.city}`,
        hasPaid: true,
        joinedDate: new Date().toISOString()
      };
      
      storageService.addUser(newUser);
      onComplete(newUser.username);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Info */}
        <div className="w-full md:w-1/3 bg-blue-600 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <BookOpen className="w-8 h-8" />
              <span className="text-2xl font-bold">LernKraft</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {step === 1 ? "Starten wir!" : "Fast geschafft."}
            </h2>
            <p className="text-blue-100 leading-relaxed">
              {step === 1 
                ? "Erstelle dein Konto, um Zugang zu professioneller Nachhilfe in Mathe, Deutsch und Englisch zu erhalten."
                : "Sichere dir jetzt deinen Zugang. Keine versteckten Kosten, jederzeit kündbar."
              }
            </p>
          </div>
          <div className="mt-8 flex space-x-2">
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-white' : 'w-2 bg-blue-400'}`} />
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-white' : 'w-2 bg-blue-400'}`} />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-2/3 p-8 md:p-12">
          <form onSubmit={handleFinish}>
            {step === 1 ? (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Persönliche Daten</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Vorname</label>
                    <input name="firstName" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} value={formData.firstName} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Nachname</label>
                    <input name="lastName" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} value={formData.lastName} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Adresse</label>
                  <input name="address" required placeholder="Straße, Hausnummer" className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} value={formData.address} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">PLZ</label>
                    <input name="zip" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} value={formData.zip} />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Stadt</label>
                    <input name="city" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} value={formData.city} />
                  </div>
                </div>

                <div className="space-y-1 pt-4 border-t border-slate-100">
                   <label className="text-xs font-bold text-slate-500 uppercase">Gewünschter Benutzername</label>
                   <input name="username" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} value={formData.username} />
                </div>

                <div className="flex justify-between pt-6">
                  <button type="button" onClick={onCancel} className="text-slate-500 hover:text-slate-800 font-medium">Abbrechen</button>
                  <button type="button" onClick={() => setStep(2)} className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center font-bold">
                    Weiter <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Zahlungsinformationen</h3>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">LernKraft Premium</p>
                    <p className="text-sm text-slate-500">Monatlich kündbar</p>
                  </div>
                  <span className="text-xl font-bold text-blue-600">19,99€<span className="text-sm text-slate-400 font-normal">/Monat</span></span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Karteninhaber</label>
                  <input name="cardName" required placeholder="Wie auf der Karte angegeben" className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} value={formData.cardName} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Kartennummer</label>
                  <div className="relative">
                    <input name="cardNumber" required placeholder="0000 0000 0000 0000" className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none pl-12" onChange={handleChange} value={formData.cardNumber} />
                    <CreditCard className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Gültig bis</label>
                    <input name="expiry" required placeholder="MM/YY" className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} value={formData.expiry} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">CVV</label>
                    <input name="cvv" required placeholder="123" className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} value={formData.cvv} />
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button type="button" onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800 font-medium">Zurück</button>
                  <button type="submit" className="bg-emerald-500 text-white px-8 py-3 rounded-xl hover:bg-emerald-600 transition-colors flex items-center font-bold shadow-lg shadow-emerald-200">
                    Kostenpflichtig bestellen <Check className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};