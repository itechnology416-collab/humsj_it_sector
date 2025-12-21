import { 
  Clock, 
  Heart, 
  CheckCircle, 
  Star, 
  BookOpen, 
  Globe, 
  Award,
  Users,
  Sparkles,
  Quote,
  Calendar,
  MapPin
} from "lucide-react";

export function TimelineOfIslamicCivilization() {
  return (
    <section className="section py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-6 py-2 mb-6">
            <Clock size={16} className="text-blue-500 animate-pulse" />
            <span className="text-sm text-blue-600 font-medium">Islamic Heritage</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display tracking-wide mb-6">
            Timeline of
            <span className="block bg-gradient-to-r from-blue-500 to-primary bg-clip-text text-transparent">
              Islamic Civilization
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Journey through the golden ages of Islamic history and civilization
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-primary to-secondary rounded-full"></div>
          
          <div className="space-y-16">
            {[
              {
                period: "Pre-Islamic Arabia",
                year: "Before 610 CE",
                title: "The Age of Ignorance (Jahiliyyah)",
                description: "Arabia before the light of Islam, characterized by tribal conflicts and idol worship",
                icon: "🏜️",
                side: "left"
              },
              {
                period: "Prophethood",
                year: "610-632 CE",
                title: "The Final Revelation",
                description: "Prophet Muhammad ﷺ receives the Quran and establishes the foundation of Islamic civilization",
                icon: "🕌",
                side: "right"
              },
              {
                period: "Khulafa' ar-Rashidun",
                year: "632-661 CE",
                title: "The Rightly-Guided Caliphs",
                description: "Abu Bakr, Umar, Uthman, and Ali expand Islam across Arabia, Persia, and Byzantine territories",
                icon: "👑",
                side: "left"
              },
              {
                period: "Umayyad Dynasty",
                year: "661-750 CE",
                title: "Expansion and Consolidation",
                description: "Islam spreads to Spain, Central Asia, and India. Arabic becomes the language of science",
                icon: "🌍",
                side: "right"
              },
              {
                period: "Abbasid Golden Age",
                year: "750-1258 CE",
                title: "The House of Wisdom",
                description: "Peak of Islamic civilization with advances in science, medicine, mathematics, and philosophy",
                icon: "📚",
                side: "left"
              },
              {
                period: "Modern Revival",
                year: "1800-Present",
                title: "Islamic Renaissance",
                description: "Contemporary Islamic movements and the integration of Islamic values with modern technology",
                icon: "🚀",
                side: "right"
              }
            ].map((era, index) => (
              <div key={era.period} className={`flex items-center ${era.side === 'right' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-1/2 ${era.side === 'right' ? 'pl-12' : 'pr-12'}`}>
                  <div className={`bg-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up ${era.side === 'right' ? 'text-right' : ''}`}
                       style={{ animationDelay: `${index * 200}ms` }}>
                    <div className="text-4xl mb-4">{era.icon}</div>
                    <div className="text-sm text-primary font-medium mb-2">{era.year}</div>
                    <h3 className="text-xl font-display tracking-wide mb-3">{era.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{era.description}</p>
                  </div>
                </div>
                
                {/* Timeline Node */}
                <div className="w-6 h-6 bg-primary rounded-full border-4 border-background shadow-red animate-glow relative z-10"></div>
                
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LifeOfProphetMuhammad() {
  return (
    <section className="section py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-6 py-2 mb-6">
            <Heart size={16} className="text-green-500 animate-pulse" />
            <span className="text-sm text-green-600 font-medium">Seerah Highlights</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display tracking-wide mb-6">
            Life of Prophet
            <span className="block bg-gradient-to-r from-green-500 to-primary bg-clip-text text-transparent">
              Muhammad ﷺ
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The blessed life of the final messenger, a mercy to all mankind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Birth & Early Life",
              period: "570-610 CE",
              description: "Born in Mecca, orphaned early, known as Al-Amin (The Trustworthy) for his honesty and integrity",
              icon: "🌟",
              highlights: ["Born in the Year of the Elephant", "Raised by grandfather Abdul Muttalib", "Married Khadijah (RA)", "Known for truthfulness"]
            },
            {
              title: "The First Revelation",
              period: "610 CE",
              description: "Received the first verses of the Quran in the Cave of Hira, beginning his prophetic mission",
              icon: "📖",
              highlights: ["Cave of Hira meditation", "Angel Jibril's first visit", "Iqra - Read!", "Khadijah's support"]
            },
            {
              title: "The Hijrah",
              period: "622 CE",
              description: "Migration from Mecca to Medina, marking the beginning of the Islamic calendar",
              icon: "🐪",
              highlights: ["Persecution in Mecca", "Journey to Medina", "Islamic calendar begins", "First Islamic state"]
            },
            {
              title: "Major Battles",
              period: "624-629 CE",
              description: "Defensive battles that established Islamic principles of warfare and justice",
              icon: "⚔️",
              highlights: ["Battle of Badr", "Battle of Uhud", "Battle of the Trench", "Treaty of Hudaybiyyah"]
            },
            {
              title: "Character & Mercy",
              period: "Throughout Life",
              description: "Exemplified the highest moral character, showing mercy even to enemies",
              icon: "💝",
              highlights: ["Forgiveness of enemies", "Kindness to animals", "Justice for all", "Compassion for the poor"]
            },
            {
              title: "The Farewell Pilgrimage",
              period: "632 CE",
              description: "Final sermon emphasizing human equality, women's rights, and completion of Islam",
              icon: "🕋",
              highlights: ["Final Hajj", "Farewell Sermon", "Completion of religion", "Return to Allah"]
            }
          ].map((phase, index) => (
            <div key={phase.title} className="bg-card rounded-xl p-6 border border-border/30 hover:border-green-500/50 transition-all duration-300 hover:scale-105 animate-slide-up group"
                 style={{ animationDelay: `${index * 150}ms` }}>
              <div className="text-4xl mb-4 text-center">{phase.icon}</div>
              <div className="text-sm text-green-600 font-medium mb-2 text-center">{phase.period}</div>
              <h3 className="text-xl font-display tracking-wide mb-3 text-center group-hover:text-green-600 transition-colors">{phase.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{phase.description}</p>
              <div className="space-y-1">
                {phase.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle size={12} className="text-green-500" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SahabaHeroesOfFaith() {
  return (
    <section className="section py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-6 py-2 mb-6">
            <Users size={16} className="text-purple-500 animate-pulse" />
            <span className="text-sm text-purple-600 font-medium">Noble Companions</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display tracking-wide mb-6">
            The Sahaba
            <span className="block bg-gradient-to-r from-purple-500 to-primary bg-clip-text text-transparent">
              Heroes of Faith
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The blessed companions who sacrificed everything for Islam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Abu Bakr (RA)",
              title: "As-Siddiq - The Truthful",
              virtue: "Leadership & Loyalty",
              description: "The first Caliph, closest companion of the Prophet, known for his unwavering faith and leadership during the Ridda wars",
              icon: "👑",
              quote: "If I were to take a friend other than my Lord, I would take Abu Bakr as a friend",
              achievements: ["First male convert", "Accompanied Prophet in Hijrah", "First Caliph", "Compiled the Quran"]
            },
            {
              name: "Umar ibn al-Khattab (RA)",
              title: "Al-Faruq - The Criterion",
              virtue: "Justice & Strength",
              description: "The second Caliph, known for his justice, administrative genius, and expansion of the Islamic empire",
              icon: "⚖️",
              quote: "I fear no one except Allah, and I hope for nothing except His mercy",
              achievements: ["Conquered Jerusalem", "Established Islamic calendar", "Created administrative system", "Known for justice"]
            },
            {
              name: "Uthman ibn Affan (RA)",
              title: "Dhun-Nurayn - Possessor of Two Lights",
              virtue: "Generosity & Piety",
              description: "The third Caliph, married two daughters of the Prophet, known for his generosity and compilation of the Quran",
              icon: "💎",
              quote: "The most generous of people in spending for Allah's cause",
              achievements: ["Married Prophet's daughters", "Standardized Quran", "Expanded the empire", "Built wells and mosques"]
            },
            {
              name: "Ali ibn Abi Talib (RA)",
              title: "Asadullah - Lion of Allah",
              virtue: "Knowledge & Courage",
              description: "The fourth Caliph, cousin and son-in-law of the Prophet, known for his knowledge, bravery, and eloquence",
              icon: "🦁",
              quote: "Knowledge is better than wealth, for knowledge guards you while you guard wealth",
              achievements: ["First young male convert", "Brave warrior", "Gate of knowledge", "Father of Hasan & Husayn"]
            }
          ].map((sahabi, index) => (
            <div key={sahabi.name} className="bg-card rounded-xl p-6 border border-border/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 animate-slide-up group"
                 style={{ animationDelay: `${index * 150}ms` }}>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{sahabi.icon}</div>
                <h3 className="text-xl font-display tracking-wide mb-1 group-hover:text-purple-600 transition-colors">{sahabi.name}</h3>
                <p className="text-sm text-purple-600 font-medium mb-2">{sahabi.title}</p>
                <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-xs font-medium">
                  {sahabi.virtue}
                </span>
              </div>
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{sahabi.description}</p>
              
              <div className="bg-secondary/30 rounded-lg p-3 mb-4">
                <Quote size={14} className="text-purple-500 mb-2" />
                <p className="text-xs italic text-muted-foreground">{sahabi.quote}</p>
              </div>
              
              <div className="space-y-1">
                {sahabi.achievements.map((achievement, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Star size={12} className="text-purple-500" />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IslamInEthiopia() {
  return (
    <section className="section py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-6 py-2 mb-6">
            <MapPin size={16} className="text-amber-500 animate-pulse" />
            <span className="text-sm text-amber-600 font-medium">🇪🇹 Special Heritage</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display tracking-wide mb-6">
            Islam in
            <span className="block bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">
              Ethiopia
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The blessed land that protected the early Muslims - a special place in Islamic history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            <div className="bg-card rounded-xl p-8 border border-border/30 hover:border-amber-500/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center text-3xl">
                  👑
                </div>
                <div>
                  <h3 className="text-2xl font-display tracking-wide">An-Najashi (The Negus)</h3>
                  <p className="text-amber-600 font-medium">The Just Christian King</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                King Armah (An-Najashi) of Aksum provided sanctuary to the early Muslim refugees, 
                demonstrating justice and protection that earned him praise from Prophet Muhammad ﷺ.
              </p>
              <div className="bg-amber-500/10 rounded-lg p-4">
                <Quote size={16} className="text-amber-500 mb-2" />
                <p className="text-sm italic text-amber-600">
                  "In Abyssinia there is a king under whom no one is persecuted. 
                  It is a land of justice where Allah will give you relief from your troubles."
                </p>
                <p className="text-xs text-muted-foreground mt-2">- Prophet Muhammad ﷺ</p>
              </div>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border/30 hover:border-amber-500/50 transition-all duration-300">
              <h4 className="text-xl font-display tracking-wide mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-amber-500" />
                Historical Timeline
              </h4>
              <div className="space-y-4">
                {[
                  { year: "615 CE", event: "First Hijrah to Abyssinia", description: "83 Muslims migrate to escape persecution" },
                  { year: "616 CE", event: "Second Migration", description: "More Muslims join the first group" },
                  { year: "629 CE", event: "An-Najashi's Death", description: "Prophet ﷺ prays funeral prayer in absentia" },
                  { year: "Present", event: "Islamic Heritage", description: "Ethiopia remains home to millions of Muslims" }
                ].map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-amber-600">{event.year}</span>
                        <span className="text-sm font-semibold">{event.event}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card rounded-xl p-8 border border-border/30 hover:border-amber-500/50 transition-all duration-300">
              <h4 className="text-xl font-display tracking-wide mb-6 flex items-center gap-2">
                <Globe size={20} className="text-amber-500" />
                Islamic Heritage Sites
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { name: "Harar", description: "The fourth holiest city in Islam, known as the 'City of Saints'" },
                  { name: "Negash Mosque", description: "First mosque in Africa, built by the early Muslim refugees" },
                  { name: "Bilal al-Habashi Mosque", description: "Named after the first muezzin of Islam" },
                  { name: "Islamic Manuscripts", description: "Ancient Quranic texts and Islamic literature preserved" }
                ].map((site, index) => (
                  <div key={index} className="bg-secondary/30 rounded-lg p-4">
                    <h5 className="font-semibold mb-1">{site.name}</h5>
                    <p className="text-sm text-muted-foreground">{site.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500/10 to-primary/10 rounded-xl p-8 border border-amber-500/20">
              <h4 className="text-xl font-display tracking-wide mb-4 text-center">
                Modern Ethiopian Muslims
              </h4>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-amber-600 mb-1">34%</div>
                  <div className="text-sm text-muted-foreground">of Population</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600 mb-1">40M+</div>
                  <div className="text-sm text-muted-foreground">Muslims</div>
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground mt-4">
                Ethiopia continues to be a beacon of religious tolerance and Islamic heritage
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}