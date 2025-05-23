
import React from 'react';

interface LeaderboardEntryProps {
  rank: number;
  name: string;
  points: number;
  avatar?: string;
}

interface LeaderboardCardProps {
  title: string;
  entries: LeaderboardEntryProps[];
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ title, entries }) => {
  return (
    <div className="game-card overflow-hidden">
      <div className="bg-webapp-accent text-webapp-primary p-4 rounded-t-xl">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      
      <div className="p-4 bg-white rounded-b-xl">
        <div className="flex justify-around mb-6">
          {entries.slice(0, 3).map((entry, index) => (
            <div key={index} className="flex flex-col items-center">
              {entry.avatar && (
                <div className="relative mb-1">
                  <img 
                    src={entry.avatar} 
                    alt={entry.name} 
                    className="w-12 h-12 rounded-full border-2 border-webapp-tertiary"
                  />
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold
                    ${index === 0 ? 'bg-webapp-secondary' : index === 1 ? 'bg-webapp-tertiary' : 'bg-webapp-primary'}`}>
                    {index + 1}
                  </div>
                </div>
              )}
              <span className="font-medium text-sm">{entry.name}</span>
              <span className="text-xs bg-webapp-tertiary text-webapp-primary px-2 py-1 rounded-full">
                {entry.points} pts
              </span>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          {entries.slice(3).map((entry, index) => (
            <div key={index + 3} className="flex items-center p-2 rounded-lg bg-gray-50">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-webapp-primary font-bold mr-2">
                {index + 4}
              </div>
              {entry.avatar && (
                <img 
                  src={entry.avatar} 
                  alt={entry.name} 
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <span className="flex-grow font-medium text-sm">{entry.name}</span>
              <span className="text-xs bg-webapp-tertiary text-webapp-primary px-2 py-1 rounded-full">
                {entry.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
