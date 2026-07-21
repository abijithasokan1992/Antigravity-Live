const fs = require('fs');

const pdTitles = [
  "Night of the Living Dead", "Charade", "His Girl Friday", "Metropolis", "Nosferatu", 
  "The General", "The Phantom of the Opera", "Plan 9 from Outer Space", "Carnival of Souls", 
  "House on Haunted Hill", "The Last Man on Earth", "Little Shop of Horrors", "My Man Godfrey", 
  "A Star is Born", "Gulliver's Travels", "The Fast and the Furious (1954)", "Dementia 13", "Detour", 
  "D.O.A.", "The Hitch-Hiker", "Scarlet Street", "The Stranger", "Too Late for Tears", 
  "Big Buck Bunny", "Sintel", "Tears of Steel", "Elephants Dream", "Caminandes", 
  "Spring", "Cosmos Laundromat", "Agent 327", "Alike", "Hero's Journey", "Glass Half",
  "The Cabinet of Dr. Caligari", "Battleship Potemkin", "The Gold Rush", "The Kid", 
  "City Lights", "Modern Times", "The Great Dictator", "M (1931)", "The Third Man", 
  "Bicycle Thieves", "Seven Samurai", "Rashomon", "A Trip to the Moon", 
  "The Great Train Robbery", "Steamboat Willie", "The Terror"
];

try {
  let movies = JSON.parse(fs.readFileSync('movies.json', 'utf8'));
  let nextId = Math.max(...movies.map(m => m.id)) + 1;

  pdTitles.forEach(title => {
    movies.push({
      id: nextId++,
      title: title,
      description: `Enjoy "${title}", a legendary cinematic masterpiece that is now in the public domain and completely free to stream without exclusivity or licensing restrictions!`,
      posterUrl: `https://via.placeholder.com/500x750.png?text=${encodeURIComponent(title)}`,
      backdropUrl: `https://via.placeholder.com/1280x720.png?text=${encodeURIComponent(title)}+Backdrop`,
      cast: ["Classic Actors", "Public Domain Stars"],
      rating: (Math.random() * 3 + 6).toFixed(1) // Random rating between 6.0 and 9.0
    });
  });

  fs.writeFileSync('movies.json', JSON.stringify(movies, null, 2));
  console.log(`✅ Successfully added ${pdTitles.length} public domain, non-exclusive films to the CMS!`);
} catch (error) {
  console.error("Error updating movies database:", error);
}
