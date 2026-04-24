const ReturnProgress = ({ status }) => {
  const steps = [
    { label: 'Requested', icon: '📝', color: 'blue' },
    { label: 'Approved', icon: '✅', color: 'green' },
    { label: 'Picked Up', icon: '🚚', color: 'yellow' },
    { label: 'Refunded', icon: '💳', color: 'purple' }
  ];
  
  const getStepIndex = (currentStatus) => {
    const idx = steps.findIndex(s => s.label === currentStatus);
    return idx === -1 ? 0 : idx;
  };

  const currentIndex = getStepIndex(status);

  const getColorClasses = (color, isActive, isCurrent) => {
    if (!isActive) return 'bg-white/5 border-white/10 text-gray-500 grayscale opacity-40';
    
    switch(color) {
      case 'blue':
        return isCurrent ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_15px_rgba(96,165,250,0.5)]' : 'bg-blue-500/40 border-blue-500 text-blue-200';
      case 'green':
        return isCurrent ? 'bg-green-500/20 border-green-400 text-green-300 shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'bg-green-500/40 border-green-500 text-green-200';
      case 'yellow':
        return isCurrent ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'bg-yellow-500/40 border-yellow-500 text-yellow-200';
      case 'purple':
        return isCurrent ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-purple-500/40 border-purple-500 text-purple-200';
      default:
        return 'bg-white/20 border-white/40 text-white';
    }
  };

  const getTextColorClasses = (color, isActive) => {
    if (!isActive) return 'text-gray-500';
    
    switch(color) {
      case 'blue': return 'text-blue-300 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]';
      case 'green': return 'text-green-300 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]';
      case 'yellow': return 'text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]';
      case 'purple': return 'text-purple-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]';
      default: return 'text-white';
    }
  };

  return (
    <div className="w-full py-8 px-4">
      <div className="relative flex justify-between">
        {/* Connecting Line Background */}
        <div className="absolute left-[10%] right-[10%] top-6 h-1.5 bg-white/10 rounded-full -z-10 shadow-inner"></div>
        
        {/* Active Connecting Line */}
        <div 
          className="absolute left-[10%] top-6 h-1.5 bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 rounded-full -z-10 transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(168,85,247,0.8)]"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 80}%` }}
        ></div>
        
        {steps.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.label} className="flex flex-col items-center relative z-10 w-1/4">
              <div 
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg transition-all duration-500 border-4 backdrop-blur-sm ${getColorClasses(step.color, isActive, isCurrent)} ${isCurrent ? 'scale-125 ring-4 ring-white/10' : isActive ? 'hover:scale-110' : ''}`}
              >
                {step.icon}
              </div>
              <div className="mt-4 flex flex-col items-center">
                <span className={`text-sm font-black transition-colors duration-500 ${getTextColorClasses(step.color, isActive)}`}>
                  {step.label}
                </span>
                {isCurrent && (
                  <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 animate-pulse ${getTextColorClasses(step.color, true)}`}>
                    Current Step
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReturnProgress;
