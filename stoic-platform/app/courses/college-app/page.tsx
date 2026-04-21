'use client';
// app/courses/college-app/page.tsx
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { COUNTRIES } from '@/lib/constants';
import { Globe, ChevronDown, ExternalLink, Calendar, FileText } from 'lucide-react';

export default function CollegeAppPage() {
  const [profile, setProfile] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [universities, setUniversities] = useState<any[]>([]);
  const [expandedUni, setExpandedUni] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (selectedCountry) loadUniversities(selectedCountry);
  }, [selectedCountry]);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(prof);
  };

  const loadUniversities = async (country: string) => {
    const { data } = await supabase.from('universities').select('*, programs(*)').eq('country', country).order('name');
    setUniversities(data || []);
  };

  return (
    <div className="flex min-h-screen bg-stoic-gray">
      <DashboardSidebar role={profile?.role} userName={profile?.full_name} />
      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <div className="mb-10">
          <h1 className="text-display-sm font-black text-stoic-navy mb-2">College Application</h1>
          <p className="text-body-lg text-stoic-gray-mid">Explore universities by country and track your application.</p>
        </div>

        {/* Country selector */}
        <div className="card p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Globe size={22} className="text-stoic-gold" />
            <h2 className="text-xl font-black text-stoic-navy">Select Your Destination</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {COUNTRIES.map(country => (
              <button key={country} onClick={() => setSelectedCountry(country)}
                className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all text-center ${
                  selectedCountry === country
                    ? 'border-stoic-navy bg-stoic-navy text-white'
                    : 'border-stoic-border bg-white text-stoic-navy hover:border-stoic-navy/40'
                }`}>
                <div className="text-2xl mb-2">
                  {country === 'USA' ? '🇺🇸' : country === 'UK' ? '🇬🇧' : country === 'Australia' ? '🇦🇺' : country === 'Asia' ? '🌏' : '🏛️'}
                </div>
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* Universities */}
        {selectedCountry && (
          <div>
            <h2 className="text-xl font-black text-stoic-navy mb-5">
              Universities in {selectedCountry}
              {universities.length > 0 && <span className="text-stoic-gray-mid font-medium ml-2 text-base">({universities.length} listed)</span>}
            </h2>

            {universities.length === 0 ? (
              <div className="card p-16 text-center">
                <p className="text-xl font-bold text-stoic-navy mb-2">No universities listed yet</p>
                <p className="text-stoic-gray-mid">Your teacher is adding universities for {selectedCountry}. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {universities.map(uni => (
                  <div key={uni.id} className="card overflow-hidden">
                    <button onClick={() => setExpandedUni(expandedUni === uni.id ? null : uni.id)}
                      className="w-full flex items-center gap-5 p-6 hover:bg-stoic-gray/40 transition-colors text-left">
                      <div className="w-14 h-14 bg-stoic-navy/8 rounded-2xl flex items-center justify-center flex-shrink-0">
                        {uni.logo_url
                          ? <img src={uni.logo_url} alt={uni.name} className="w-10 h-10 object-contain" />
                          : <span className="text-xl font-black text-stoic-navy">{uni.name[0]}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-black text-stoic-navy">{uni.name}</h3>
                        <p className="text-stoic-gray-mid text-sm mt-1">{uni.location}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        {uni.ranking && <span className="badge-gold">#{uni.ranking} Ranked</span>}
                        <ChevronDown size={20} className={`text-stoic-gray-mid transition-transform ${expandedUni === uni.id ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {expandedUni === uni.id && (
                      <div className="border-t border-stoic-border p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          {uni.deadlines && (
                            <div className="bg-stoic-gray rounded-2xl p-5">
                              <div className="flex items-center gap-2 mb-3">
                                <Calendar size={16} className="text-stoic-gold" />
                                <p className="font-bold text-stoic-navy text-sm uppercase tracking-wide">Deadlines</p>
                              </div>
                              <p className="text-body-md text-stoic-navy/80 whitespace-pre-line">{uni.deadlines}</p>
                            </div>
                          )}
                          {uni.requirements && (
                            <div className="bg-stoic-gray rounded-2xl p-5">
                              <div className="flex items-center gap-2 mb-3">
                                <FileText size={16} className="text-stoic-gold" />
                                <p className="font-bold text-stoic-navy text-sm uppercase tracking-wide">Requirements</p>
                              </div>
                              <p className="text-body-md text-stoic-navy/80 whitespace-pre-line">{uni.requirements}</p>
                            </div>
                          )}
                          {uni.notes && (
                            <div className="bg-stoic-gold/8 border border-stoic-gold/20 rounded-2xl p-5">
                              <p className="font-bold text-stoic-navy text-sm uppercase tracking-wide mb-3">Notes</p>
                              <p className="text-body-md text-stoic-navy/80 whitespace-pre-line">{uni.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Programs */}
                        {uni.programs && uni.programs.length > 0 && (
                          <div>
                            <p className="font-bold text-stoic-navy mb-4 uppercase tracking-wide text-sm">Available Programs</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {uni.programs.map((prog: any) => (
                                <div key={prog.id} className="bg-stoic-gray rounded-xl p-4">
                                  <p className="font-semibold text-stoic-navy text-sm">{prog.name}</p>
                                  {prog.duration && <p className="text-xs text-stoic-gray-mid mt-1">{prog.duration}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {uni.website_url && (
                          <a href={uni.website_url} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-2 mt-6 text-stoic-navy font-semibold hover:text-stoic-gold transition-colors">
                            Visit University Website <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedCountry && (
          <div className="card p-16 text-center border-dashed">
            <Globe size={48} className="text-stoic-gray-mid mx-auto mb-4" />
            <p className="text-xl font-bold text-stoic-navy mb-2">Select a country above</p>
            <p className="text-stoic-gray-mid">Choose your destination country to see universities and requirements.</p>
          </div>
        )}
      </main>
    </div>
  );
}
