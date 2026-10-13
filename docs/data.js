// Konten aplikasi mandiri. ID stabil dipakai oleh progres dan backup.
export const LEVELS = { mubtadi: 'Mubtadi · Dasar', mutawassit: 'Mutawassit · Menengah', mutaqaddim: 'Mutaqaddim · Lanjutan' };
export const MODES = {
  ordering: { title:'Susun kalimat', short:'Susun kata', icon:'layers', description:'Temukan hubungan antarkata, lalu susun pola yang diminta.' },
  irab: { title:'Analisis i’rab', short:'I’rab', icon:'scan', description:'Tentukan kedudukan, status, dan tanda i’rab.' },
  sharaf: { title:'Telusuri sharaf', short:'Sharaf', icon:'branch', description:'Kenali akar kata dan pola pembentukannya.' },
  translation: { title:'Pilih terjemahan', short:'Terjemahan', icon:'translate', description:'Jaga makna, pelaku, objek, dan arah penerjemahan.' },
  free: { title:'Terjemahan mandiri', short:'Tulis bebas', icon:'pen', description:'Tulis terjemahan, bandingkan rujukan, dan refleksikan pilihan kata.' }
};
export const LESSONS = [
  {id:'fail',level:'mubtadi',title:'Pelaku dan objek',arabic:'الْفَاعِلُ وَالْمَفْعُولُ بِهِ',body:'Fa’il menunjukkan pelaku dalam kalimat aktif. Maf’ul bih menunjukkan objek tindakan. Pada isim mufrad mu’rab, fa’il marfu dengan dhammah dan maf’ul bih manshub dengan fathah.',example:'قَرَأَ الطَّالِبُ الْكِتَابَ',translation:'Siswa itu membaca buku itu.',note:'Jangan menentukan pelaku hanya dari posisi. Dalam bahasa Arab, objek dapat didahulukan; perhatikan i’rab dan konteks.'},
  {id:'inna',level:'mutawassit',title:'Isim dan khabar inna',arabic:'إِنَّ وَأَخَوَاتُهَا',body:'Inna dan saudara-saudaranya memasuki jumlah ismiyyah. Isimnya manshub dan khabarnya marfu. Inna memberi penegasan; terjemahan dapat menggunakan sungguh atau sesungguhnya sesuai konteks.',example:'إِنَّ الطَّالِبَ مُجْتَهِدٌ',translation:'Sungguh, siswa itu rajin.',note:'Pada isim mufrad di sini, tanda nashab adalah fathah. Pada bentuk lain, tanda penggantinya dapat berbeda.'},
  {id:'kana',level:'mutawassit',title:'Isim dan khabar kana',arabic:'كَانَ وَأَخَوَاتُهَا',body:'Kana mempertahankan isim dalam keadaan marfu dan membuat khabar manshub. Hubungan waktu atau keadaan lampau diterjemahkan sesuai konteks, tidak selalu dengan satu kata yang sama.',example:'كَانَ الطَّالِبُ مُجْتَهِدًا',translation:'Siswa itu dahulu rajin.',note:'Jangan menyamakan kaidah kana dengan inna: bagian yang manshub berbeda.'},
  {id:'hal',level:'mutaqaddim',title:'Hal dan keadaan pelaku',arabic:'الْحَالُ',body:'Hal menerangkan keadaan pemilik keadaan ketika peristiwa terjadi. Hal pada contoh tunggal biasanya berbentuk nakirah dan manshub, sedangkan pemilik keadaannya dapat berupa isim ma’rifah.',example:'عَادَ الْمُسَافِرُ مُتْعَبًا',translation:'Pelancong itu kembali dalam keadaan lelah.',note:'Bandingkan hal dengan na’at. Pada contoh ini musafir ma’rifah, tetapi mut’aban nakirah; ia menjelaskan keadaan saat kembali.'},
  {id:'tamyiz',level:'mutaqaddim',title:'Tamyiz dan penjelas makna',arabic:'التَّمْيِيزُ',body:'Tamyiz menghilangkan kesamaran makna pada kata atau hubungan dalam kalimat. Pada contoh ini, عِلْمًا menjelaskan aspek pertambahan: yang bertambah adalah pengetahuan.',example:'ازْدَادَ الطَّالِبُ عِلْمًا',translation:'Pengetahuan siswa itu bertambah.',note:'عِلْمًا adalah tamyiz manshub dengan fathah. Terjemahan wajar dapat mengubah struktur permukaan tanpa mengubah makna.'},
  {id:'majhul',level:'mutaqaddim',title:'Fi’il pasif dan na’ibul fa’il',arabic:'الْمَبْنِيُّ لِلْمَجْهُولِ',body:'Dalam kalimat pasif, pelaku tidak disebutkan. Na’ibul fa’il menggantikan posisi sintaksis fa’il dan berstatus marfu. Bentuk fi’il ikut berubah.',example:'كُتِبَ الدَّرْسُ',translation:'Pelajaran itu ditulis.',note:'الدَّرْسُ bukan maf’ul bih dalam kalimat ini. Ia na’ibul fa’il, meskipun secara makna merupakan hal yang ditulis.'},
  {id:'jazm',level:'mutaqaddim',title:'Lam dan jazm',arabic:'لَمْ وَالْجَزْمُ',body:'Lam menafikan fi’il mudhari dan menjazmkannya. Pada fi’il shahih akhir yang tidak tersambung bentuk khusus, tanda jazmnya sukun.',example:'لَمْ يَكْتُبْ الطَّالِبُ الدَّرْسَ',translation:'Siswa itu tidak menulis pelajaran itu.',note:'Lam mengarahkan makna ke penafian peristiwa lampau. Jangan menerjemahkannya otomatis sebagai tidak akan.'},
  {id:'nasb',level:'mutaqaddim',title:'Lan dan nashab',arabic:'لَنْ وَالنَّصْبُ',body:'Lan menafikan peristiwa yang akan datang dan menashabkan fi’il mudhari. Pada contoh shahih akhir ini tanda nashabnya fathah.',example:'لَنْ يَتْرُكَ الْبَاحِثُ عَمَلَهُ',translation:'Peneliti itu tidak akan meninggalkan pekerjaannya.',note:'Pisahkan عَمَلَ sebagai objek dari ـهُ sebagai dhamir yang menjadi mudhaf ilaih.'},
  {id:'exception',level:'mutaqaddim',title:'Istitsna dengan illa',arabic:'الِاسْتِثْنَاءُ',body:'Dalam istitsna tamm mutsbat, yakni kalimat lengkap dan afirmatif, mustatsna setelah illa dinashabkan.',example:'حَضَرَ الطُّلَّابُ إِلَّا طَالِبًا',translation:'Para siswa hadir kecuali seorang siswa.',note:'Aturan berbeda dapat berlaku untuk istitsna negatif atau tidak lengkap. Jangan memakai satu aturan untuk semua contoh illa.'},
  {id:'sharaf',level:'mubtadi',title:'Akar dan wazan',arabic:'الْجَذْرُ وَالْوَزْنُ',body:'Akar menghubungkan keluarga kata; wazan menunjukkan pola pembentukannya. كَتَبَ berpola فَعَلَ, كَاتِب berpola فَاعِل, dan مَكْتُوب berpola مَفْعُول.',example:'كَتَبَ • كَاتِب • مَكْتُوب',translation:'Menulis • penulis • yang ditulis.',note:'Wazan tidak selalu langsung tampak pada kata mu’tal. Untuk tahap lanjutan, perhatikan i’lal, idgham, dan huruf tambahan.'}
];

const subjects = [
  {nom:'الطَّالِبُ',acc:'الطَّالِبَ',id:'siswa itu',alias:'murid itu'},
  {nom:'الْمُعَلِّمُ',acc:'الْمُعَلِّمَ',id:'guru itu',alias:'pengajar itu'},
  {nom:'الْبَاحِثُ',acc:'الْبَاحِثَ',id:'peneliti itu',alias:'peneliti tersebut'}
];
const objects = [
  {acc:'الْكِتَابَ',id:'buku itu'},
  {acc:'الدَّرْسَ',id:'pelajaran itu'},
  {acc:'النَّصَّ',id:'teks itu'}
];
const verbs = [
  {ar:'قَرَأَ',id:'membaca',root:'ق ر أ',pattern:'فَعَلَ'},
  {ar:'كَتَبَ',id:'menulis',root:'ك ت ب',pattern:'فَعَلَ'}
];
const predicates = [
  {nom:'مُجْتَهِدٌ',acc:'مُجْتَهِدًا',id:'rajin',root:'ج ه د',pattern:'مُفْتَعِل',bare:'مُجْتَهِد'},
  {nom:'صَابِرٌ',acc:'صَابِرًا',id:'sabar',root:'ص ب ر',pattern:'فَاعِل',bare:'صَابِر'},
  {nom:'نَشِيطٌ',acc:'نَشِيطًا',id:'aktif',root:'ن ش ط',pattern:'فَعِيل',bare:'نَشِيط'}
];
const record = (id,level,lesson,words,translation,focus,extra={}) => ({
  id,level,lesson,words,ar:words.join(' '),translation,
  variants:[translation],focus,
  constraint:'Ikuti urutan contoh: ' + (lesson==='fail'?'fi’il → fa’il → maf’ul bih.':'partikel/fi’il pembuka → unsur berikutnya sesuai kalimat rujukan.'),
  ...extra
});
const items=[];
let seq=0;
for (const v of verbs) for (const s of subjects) for (const o of objects) {
  const target=`${s.id} ${v.id} ${o.id}`;
  items.push(record(`dasar-${++seq}`,'mubtadi','fail',[v.ar,s.nom,o.acc],target,
    {index:2,role:'Maf’ul bih',status:'Manshub',sign:'Fathah',reason:`${o.acc} merupakan objek dari ${v.ar}; sebagai isim mufrad, tanda nashabnya fathah.`},
    {variants:[target,`${s.alias} ${v.id} ${o.id}`,`${s.id} telah ${v.id} ${o.id}`],
      constraint:'Mulai dengan fi’il, lalu fa’il, kemudian maf’ul bih.',
      distractors:[`${o.id} ${v.id} ${s.id}`,`${s.id} tidak ${v.id} ${o.id}`],
      morphology:{word:v.ar,root:v.root,pattern:v.pattern,reason:'Fi’il madhi tsulatsi mujarrad pada contoh ini berpola فَعَلَ.'}}));
}
seq=0;
for (const s of subjects) for (const p of predicates) {
  items.push(record(`inna-${++seq}`,'mutawassit','inna',['إِنَّ',s.acc,p.nom],`sungguh ${s.id} ${p.id}`,
    {index:1,role:'Isim inna',status:'Manshub',sign:'Fathah',reason:'Inna menashabkan isimnya. Isim mufrad pada contoh ini ditandai fathah.'},
    {variants:[`sungguh ${s.id} ${p.id}`,`sesungguhnya ${s.id} ${p.id}`],constraint:'Mulai dengan إِنَّ, lalu isim inna, kemudian khabarnya.',distractors:[`${s.id} tidak ${p.id}`,`${s.id} dahulu ${p.id}`],morphology:{word:p.bare,root:p.root,pattern:p.pattern,reason:'Abaikan alif-lam dan harakat i’rab ketika mengenali pola dasar kata ini.'}}));
  items.push(record(`kana-${seq}`,'mutawassit','kana',['كَانَ',s.nom,p.acc],`${s.id} dahulu ${p.id}`,
    {index:2,role:'Khabar kana',status:'Manshub',sign:'Fathah',reason:'Kana merafa’kan isimnya dan menashabkan khabarnya; khabar mufrad ini bertanda fathah.'},
    {variants:[`${s.id} dahulu ${p.id}`,`${s.id} dulu ${p.id}`],constraint:'Mulai dengan كَانَ, lalu isim kana, kemudian khabarnya.',distractors:[`sungguh ${s.id} ${p.id}`,`${s.id} tidak pernah ${p.id}`],morphology:{word:p.bare,root:p.root,pattern:p.pattern,reason:'Wazan menunjukkan susunan huruf dasar dan huruf tambahan; harakat akhir mengikuti fungsi kalimat.'}}));
}
items.push(
  record('lanjut-hal','mutaqaddim','hal',['عَادَ','الْمُسَافِرُ','مُتْعَبًا'],'pelancong itu kembali dalam keadaan lelah',
    {index:2,role:'Hal',status:'Manshub',sign:'Fathah',reason:'مُتْعَبًا menerangkan keadaan musafir saat kembali, bukan sifat tetap yang mengikuti ma’rifah pemiliknya.'},
    {constraint:'Fi’il عَادَ → pelaku → hal.',variants:['pelancong itu kembali dalam keadaan lelah','musafir itu kembali dalam keadaan lelah'],distractors:['pelancong itu membuat orang lain lelah','pelancong itu tidak kembali'],morphology:{word:'مُتْعَب',root:'ت ع ب',pattern:'مُفْعَل',reason:'Isim maf’ul dari أَتْعَبَ; bedakan مُتْعَب (lelah) dari مُتْعِب (melelahkan).'}}),
  record('lanjut-tamyiz','mutaqaddim','tamyiz',['ازْدَادَ','الطَّالِبُ','عِلْمًا'],'pengetahuan siswa itu bertambah',
    {index:2,role:'Tamyiz',status:'Manshub',sign:'Fathah',reason:'عِلْمًا menjelaskan aspek pertambahan; ia tamyiz, bukan objek langsung.'},
    {constraint:'Fi’il ازْدَادَ → fa’il → tamyiz.',variants:['pengetahuan siswa itu bertambah','ilmu siswa itu bertambah'],distractors:['jumlah siswa itu bertambah','siswa itu menambah jumlah buku'],morphology:{word:'عِلْم',root:'ع ل م',pattern:'فِعْل',reason:'Masdar عِلْم memiliki pola فِعْل, bukan pola isim fa’il.'}}),
  record('lanjut-pasif','mutaqaddim','majhul',['كُتِبَ','الدَّرْسُ'],'pelajaran itu ditulis',
    {index:1,role:'Na’ibul fa’il',status:'Marfu',sign:'Dhammah',reason:'كُتِبَ berbentuk pasif. الدَّرْسُ menjadi na’ibul fa’il yang marfu, bukan maf’ul bih.'},
    {constraint:'Fi’il pasif كُتِبَ → na’ibul fa’il.',distractors:['pelajaran itu menulis','pelajaran itu akan dibaca'],morphology:{word:'كُتِبَ',root:'ك ت ب',pattern:'فُعِلَ',reason:'Fi’il madhi pasif tsulatsi pada contoh ini berpola فُعِلَ.'}}),
  record('lanjut-lam','mutaqaddim','jazm',['لَمْ','يَكْتُبْ','الطَّالِبُ','الدَّرْسَ'],'siswa itu tidak menulis pelajaran itu',
    {index:1,role:'Fi’il mudhari',status:'Majzum',sign:'Sukun',reason:'لَمْ adalah huruf jazm. يَكْتُبْ shahih akhir sehingga tanda jazmnya sukun.'},
    {constraint:'لَمْ → fi’il mudhari → fa’il → maf’ul bih.',variants:['siswa itu tidak menulis pelajaran itu','murid itu tidak menulis pelajaran itu'],distractors:['siswa itu akan menulis pelajaran itu','pelajaran itu tidak menulis siswa itu'],morphology:{word:'يَكْتُبُ',root:'ك ت ب',pattern:'يَفْعُلُ',reason:'Bentuk rujukan mudhari يَكْتُبُ berpola يَفْعُلُ. Dalam kalimat setelah lam, akhirnya menjadi sukun.'}}),
  record('lanjut-lan','mutaqaddim','nasb',['لَنْ','يَتْرُكَ','الْبَاحِثُ','عَمَلَهُ'],'peneliti itu tidak akan meninggalkan pekerjaannya',
    {index:1,role:'Fi’il mudhari',status:'Manshub',sign:'Fathah',reason:'لَنْ menashabkan fi’il mudhari dan menafikan peristiwa mendatang. يَتْرُكَ bertanda fathah.'},
    {constraint:'لَنْ → fi’il mudhari → fa’il → objek.',distractors:['peneliti itu telah meninggalkan pekerjaannya','peneliti itu akan meninggalkan pekerjaannya'],morphology:{word:'يَتْرُكُ',root:'ت ر ك',pattern:'يَفْعُلُ',reason:'Bentuk rujukan يَتْرُكُ berpola يَفْعُلُ; setelah lan tanda akhirnya fathah.'}}),
  record('lanjut-istitsna','mutaqaddim','exception',['حَضَرَ','الطُّلَّابُ','إِلَّا','طَالِبًا'],'para siswa hadir kecuali seorang siswa',
    {index:3,role:'Mustatsna',status:'Manshub',sign:'Fathah',reason:'Ini istitsna tamm mutsbat: mustatsna minhu disebut dan kalimat afirmatif, sehingga طَالِبًا manshub.'},
    {constraint:'Fi’il → fa’il → إِلَّا → mustatsna.',variants:['para siswa hadir kecuali seorang siswa','semua siswa hadir kecuali satu siswa'],distractors:['tidak ada siswa yang hadir','hanya seorang siswa yang hadir'],morphology:{word:'طَالِب',root:'ط ل ب',pattern:'فَاعِل',reason:'طَالِب adalah isim fa’il dengan pola فَاعِل.'}})
);
export const SENTENCES=items;
export const ROLES=['Fa’il','Maf’ul bih','Isim inna','Khabar inna','Isim kana','Khabar kana','Hal','Tamyiz','Na’ibul fa’il','Fi’il mudhari','Mustatsna'];
export const STATUSES=['Marfu','Manshub','Majrur','Majzum','Mabni'];
export const SIGNS=['Dhammah','Fathah','Kasrah','Sukun','Alif','Waw','Ya'];
export const ROOTS=[...new Set(items.map(s=>s.morphology.root))];
export const PATTERNS=[...new Set(items.map(s=>s.morphology.pattern))];
