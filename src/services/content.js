import api from './api';

// Mock data to simulate API responses since backend might not be ready
const MOCK_DATA = {
  biography: [
    {
      id: 1,
      year: '570 CE',
      date: '570-04-22',
      title: 'The Year of the Elephant',
      titleAr: 'عام الفيل',
      description: 'Birth of Prophet Muhammad ﷺ in Mecca. His father Abdullah had passed away before his birth.',
      descriptionAr: 'مولد النبي محمد ﷺ في مكة المكرمة. توفي والده عبد الله قبل ولادته.',
      category: 'Birth',
      icon: 'biography'
    },
    {
      id: 2,
      year: '576 CE',
      date: '576-01-01',
      title: 'Loss of Mother',
      titleAr: 'وفاة الأم',
      description: 'His mother Aminah passes away when he is six years old. He is taken into the care of his grandfather Abdul-Muttalib.',
      descriptionAr: 'وفاة والدته آمنة بنت وهب وهو في السادسة من عمره، وكفله جده عبد المطلب.',
      category: 'Childhood',
      icon: 'biography'
    },
    {
      id: 3,
      year: '610 CE',
      date: '610-08-10',
      title: 'The First Revelation',
      titleAr: 'نزول الوحي',
      description: 'At age 40, receiving the first verses of Quran in Cave Hira.',
      descriptionAr: 'نزول أول آيات القرآن الكريم عليه في غار حراء وهو في الأربعين من عمره.',
      category: 'Prophethood',
      icon: 'biography'
    },
    {
      id: 4,
      year: '622 CE',
      date: '622-09-24',
      title: 'The Hijrah',
      titleAr: 'الهجرة النبوية',
      description: 'Migration to Medina and establishment of the first Islamic state.',
      descriptionAr: 'الهجرة من مكة إلى المدينة المنورة وتأسيس الدولة الإسلامية الأولى.',
      category: 'Migration',
      icon: 'biography'
    }
  ],
  hadiths: [
    {
      id: 1,
      text: "Actions are judged by intentions, so each man will have what he intended.",
      textAr: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى",
      source: "Sahih Al-Bukhari",
      sourceAr: "صحيح البخاري",
      category: "Intention",
      tags: ["Faith", "Sincerity"]
    },
    {
      id: 2,
      text: "None of you will have faith till he wishes for his (Muslim) brother what he likes for himself.",
      textAr: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه",
      source: "Bukhari & Muslim",
      sourceAr: "متفق عليه",
      category: "Brotherhood",
      tags: ["Ethics", "Community"]
    },
    {
      id: 3,
      text: "The strong is not the one who overcomes the people by his strength, but the strong is the one who controls himself while in anger.",
      textAr: "ليس الشديد بالصرعة، إنما الشديد الذي يملك نفسه عند الغضب",
      source: "Sahih Al-Bukhari",
      sourceAr: "صحيح البخاري",
      category: "Character",
      tags: ["Self-control", "Manners"]
    }
  ],
  companions: [
    {
      id: 1,
      name: "Abu Bakr As-Siddiq",
      nameAr: "أبو بكر الصديق",
      title: "The Truthful",
      titleAr: "الصديق",
      description: "The closest companion and first Caliph, known for his unwavering faith.",
      descriptionAr: "أقرب الصحابة وأول الخلفاء الراشدين، عرف بإيمانه الراسخ.",
      category: "Muhajirun",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Umar ibn Al-Khattab",
      nameAr: "عمر بن الخطاب",
      title: "Al-Faruq",
      titleAr: "الفاروق",
      description: "Known for his justice, strength, and pivotal role in expanding the Islamic state.",
      descriptionAr: "عرف بعدله وقوته ودوره المحوري في توسيع الدولة الإسلامية.",
      category: "Muhajirun",
      image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&auto=format&fit=crop"
    }
  ],
  battles: [
    {
      id: 1,
      name: "Battle of Badr",
      nameAr: "غزوة بدر",
      date: "624 CE",
      result: "Victory",
      description: "The first major battle between Muslims and Quraysh.",
      descriptionAr: "أول معركة كبرى بين المسلمين وقريش، انتهت بانتصار المسلمين.",
      stats: [{ label: 'Muslims', value: '313' }, { label: 'Quraysh', value: '1000' }]
    },
    {
      id: 2,
      name: "Battle of Uhud",
      nameAr: "غزوة أحد",
      date: "625 CE",
      result: "Setback",
      description: "A battle of great lessons regarding obedience to the Prophet.",
      descriptionAr: "معركة مليئة بالدروس والعبر حول أهمية طاعة الرسول.",
      stats: [{ label: 'Muslims', value: '700' }, { label: 'Quraysh', value: '3000' }]
    }
  ]
};

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  async getBiography() {
    await delay(500);
    return MOCK_DATA.biography;
  },

  async getHadiths(params = {}) {
    await delay(600);
    let data = [...MOCK_DATA.hadiths];
    if (params.category) {
      data = data.filter(h => h.category === params.category);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      data = data.filter(h => 
        h.text.toLowerCase().includes(q) || 
        h.textAr.includes(q)
      );
    }
    return data;
  },

  async getCompanions() {
    await delay(700);
    return MOCK_DATA.companions;
  },

  async getBattles() {
    await delay(500);
    return MOCK_DATA.battles;
  },
  
  async getWisdom() {
    await delay(400);
    // Returning hadiths as wisdom for now
    return MOCK_DATA.hadiths.map(h => ({
      ...h,
      type: 'wisdom'
    }));
  }
};