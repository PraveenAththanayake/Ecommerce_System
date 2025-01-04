export const TopBar = () => (
  <div className="hidden lg:block bg-primary/5 dark:bg-primary/10">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between h-10 text-xs">
        <div className="flex items-center space-x-4">
          <span>📱 Download our app</span>
          <span>🌍 Ship worldwide</span>
          <span>💫 New customer discount: 15% OFF</span>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/track-order" className="hover:text-primary">
            Track Order
          </a>
          <a href="/help" className="hover:text-primary">
            Help Center
          </a>
          <select className="bg-transparent text-xs">
            <option>🇺🇸 USD</option>
            <option>🇪🇺 EUR</option>
            <option>🇬🇧 GBP</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);
