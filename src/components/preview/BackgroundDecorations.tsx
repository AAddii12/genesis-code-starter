
export const BackgroundDecorations = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Main blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#e9d8f4] rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#f1e2fa] rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
      <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-[#e5d8ff] rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s', animationDuration: '10s' }}></div>
      
      {/* Small decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-white rounded-full blur-2xl opacity-20"></div>
      <div className="absolute bottom-1/3 left-1/3 w-32 h-32 bg-[#f5eeff] rounded-full blur-2xl opacity-30"></div>
      
      {/* Subtle patterns */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIvPjxwYXRoIGQ9Ik0xMCAyMGEyIDIgMCAxIDAgMC00IDIgMiAwIDAgMCAwIDR6bTIwIDBhMiAyIDAgMSAwIDAtNCAyIDIgMCAwIDAgMCA0eiIgZmlsbD0icmdiYSgyMjUsMjE1LDI1NSwwLjEpIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L2c+PC9zdmc+')] opacity-5"></div>
    </div>
  );
};
