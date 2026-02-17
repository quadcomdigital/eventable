import React, { useState } from 'react';
import { SparklesIcon, CheckIcon, HeartIcon, UsersIcon, GiftIcon, BuildingOffice2Icon, PlusCircleIcon, TagIcon } from './Icons';

interface CreateEventWizardProps {
    onCancel: () => void;
    onSave: (eventDetails: any) => void; // A more specific type could be used here
}

const steps = ['Dettagli', 'Servizi', 'Invitati', 'Riepilogo'];

const initialEventTypes = [
  { name: 'Matrimonio', icon: <HeartIcon className="w-8 h-8" /> },
  { name: 'Comunione', icon: <GiftIcon className="w-8 h-8" /> },
  { name: 'Evento Privato', icon: <UsersIcon className="w-8 h-8" /> },
  { name: 'Festa Aziendale', icon: <BuildingOffice2Icon className="w-8 h-8" /> },
];

const CreateEventWizard: React.FC<CreateEventWizardProps> = ({ onCancel, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventTypes, setEventTypes] = useState(initialEventTypes);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [isCreatingNewType, setIsCreatingNewType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [eventDetails, setEventDetails] = useState({
    name: '',
    date: '',
    guests: '',
    budget: '',
  });

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  
  const handleSaveAndFinish = () => {
    const newEventData = {
        name: eventDetails.name,
        date: new Date(eventDetails.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', ''),
        guestCount: parseInt(eventDetails.guests, 10) || 0,
        budget: parseInt(eventDetails.budget, 10) || 0,
    };
    onSave(newEventData);
  };

  const handleAddEventType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTypeName.trim() !== '' && !eventTypes.some(et => et.name.toLowerCase() === newTypeName.trim().toLowerCase())) {
        const newType = {
            name: newTypeName.trim(),
            icon: <TagIcon className="w-8 h-8" />
        };
        setEventTypes([...eventTypes, newType]);
        setSelectedEventType(newType.name);
        setNewTypeName('');
        setIsCreatingNewType(false);
    }
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventDetails({
        ...eventDetails,
        [e.target.name]: e.target.value,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="w-full">
            <h2 className="text-2xl font-semibold text-stone-700 text-center">Che tipo di evento stai pianificando?</h2>
            <p className="text-stone-500 mt-2 text-center mb-8">La selezione ci aiuterà a personalizzare la tua esperienza.</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {eventTypes.map((type) => {
                const isSelected = selectedEventType === type.name;
                return (
                  <button
                    key={type.name}
                    onClick={() => {
                        setSelectedEventType(type.name)
                        setIsCreatingNewType(false);
                    }}
                    className={`relative text-center p-6 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 shadow-lg'
                        : 'bg-stone-50/70 border-stone-200 hover:border-amber-300 hover:shadow-md'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-amber-400 text-white rounded-full p-0.5">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                    )}
                    <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-3 transition-colors ${
                        isSelected ? 'bg-amber-100 text-amber-500' : 'bg-stone-200 text-stone-500'
                    }`}>
                      {type.icon}
                    </div>
                    <p className={`font-semibold transition-colors ${isSelected ? 'text-amber-700' : 'text-stone-700'}`}>{type.name}</p>
                  </button>
                );
              })}
              <button
                onClick={() => setIsCreatingNewType(true)}
                className="text-center p-6 rounded-xl border-2 border-dashed border-stone-300 text-stone-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex flex-col items-center justify-center"
              >
                  <PlusCircleIcon className="w-16 h-16 text-stone-400" />
                  <p className="font-semibold">Aggiungi Nuovo</p>
              </button>
            </div>
            {isCreatingNewType && (
                <form onSubmit={handleAddEventType} className="mt-6 max-w-md mx-auto p-4 bg-stone-100/70 rounded-lg border border-stone-200/80">
                    <h3 className="font-semibold text-stone-700 mb-2 text-center">Crea un nuovo tipo di evento</h3>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newTypeName}
                            onChange={(e) => setNewTypeName(e.target.value)}
                            placeholder="Es. Battesimo, Laurea..."
                            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            autoFocus
                        />
                        <button type="submit" className="bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors">Salva</button>
                        <button type="button" onClick={() => setIsCreatingNewType(false)} className="bg-stone-200 text-stone-700 font-semibold px-4 py-2 rounded-lg hover:bg-stone-300 transition-colors">Annulla</button>
                    </div>
                </form>
            )}
          </div>
        );
      case 2:
        return (
            <div className="w-full max-w-lg mx-auto">
                <h2 className="text-2xl font-semibold text-stone-700 text-center mb-1">Informazioni Principali</h2>
                <p className="text-stone-500 text-center mb-8">Inserisci i dettagli fondamentali per iniziare.</p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Nome Evento</label>
                        <input type="text" name="name" id="name" value={eventDetails.name} onChange={handleDetailChange} placeholder="Es. Matrimonio Rossi, Convention Aziendale" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                     <div>
                        <label htmlFor="date" className="block text-sm font-medium text-stone-700 mb-1">Data Evento</label>
                        <input type="date" name="date" id="date" value={eventDetails.date} onChange={handleDetailChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div>
                        <label htmlFor="guests" className="block text-sm font-medium text-stone-700 mb-1">Numero Ospiti (stimato)</label>
                        <input type="number" name="guests" id="guests" value={eventDetails.guests} onChange={handleDetailChange} min="0" placeholder="100" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                     <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-stone-700 mb-1">Budget Approssimativo (€)</label>
                        <input type="number" name="budget" id="budget" value={eventDetails.budget} onChange={handleDetailChange} min="0" step="100" placeholder="5000" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                </div>
            </div>
        );
      case 3:
        return <div className="text-center"><h2 className="text-2xl font-semibold text-stone-700">Step 3: Carica la lista invitati</h2><p className="text-stone-500 mt-2">Qui ci sarà l'opzione per caricare un file o inserire manualmente gli invitati.</p></div>;
      case 4:
        return <div className="text-center"><h2 className="text-2xl font-semibold text-stone-700">Step 4: Riepilogo e conferma</h2><p className="text-stone-500 mt-2">Qui verrà mostrato un riepilogo di tutte le scelte prima della creazione finale.</p></div>;
      default:
        return null;
    }
  };
  
  const isNextDisabled = () => {
    if (currentStep === 1 && !selectedEventType) return true;
    if (currentStep === 2 && (!eventDetails.name.trim() || !eventDetails.date)) return true;
    return false;
  }

  return (
    <>
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3">
          <SparklesIcon className="w-8 h-8 text-amber-500" />
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">Crea un Nuovo Evento</h1>
        </div>
        <p className="mt-2 text-lg text-stone-600">
          Segui i passaggi per configurare il tuo evento in modo simple e veloce.
        </p>
      </div>

      {/* Stepper */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                    currentStep > index ? 'bg-amber-400 text-white' : 'bg-stone-200 text-stone-500'
                  } ${currentStep === index + 1 ? 'ring-4 ring-amber-400/30' : ''}`}
                >
                   {currentStep > index + 1 ? <CheckIcon className="w-6 h-6"/> : index + 1}
                </div>
                <p className={`mt-2 text-xs sm:text-sm font-semibold ${currentStep >= index + 1 ? 'text-amber-600' : 'text-stone-500'}`}>
                  {step}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${currentStep > index + 1 ? 'bg-amber-400' : 'bg-stone-200'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-stone-200/80 p-8 sm:min-h-[400px] flex items-center justify-center">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={currentStep === 1 ? onCancel : handleBack}
          className="bg-stone-200 text-stone-700 font-semibold px-6 py-3 rounded-lg hover:bg-stone-300 transition-colors"
        >
          {currentStep === 1 ? 'Annulla' : 'Indietro'}
        </button>
        <button
          onClick={currentStep === steps.length ? handleSaveAndFinish : handleNext}
          disabled={isNextDisabled()}
          className="bg-amber-400 text-white font-semibold px-6 py-3 rounded-lg hover:bg-amber-500 transition-colors shadow-sm hover:shadow-md disabled:bg-amber-300 disabled:cursor-not-allowed"
        >
          {currentStep === steps.length ? 'Conferma e Crea Evento' : 'Avanti'}
        </button>
      </div>
    </>
  );
};

export default CreateEventWizard;