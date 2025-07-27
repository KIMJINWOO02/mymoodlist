import { Option } from '@/types';

export const sceneOptions: Option[] = [
  { id: 'dawn-city', label: '고요한 새벽 도시', description: 'Quiet dawn city with empty streets' },
  { id: 'fantasy-world', label: '빛나는 판타지 세계', description: 'Glowing fantasy realm with magic' },
  { id: 'winter-fireplace', label: '따뜻한 겨울 벽난로 앞', description: 'Cozy winter fireplace scene' },
  { id: 'space-station', label: '우주 정거장에서 바라본 지구', description: 'Earth view from space station' },
  { id: 'forest-lake', label: '숲속 호숫가', description: 'Peaceful lake in the forest' },
  { id: 'mountain-peak', label: '산 정상의 일출', description: 'Sunrise from mountain peak' },
  { id: 'ocean-waves', label: '파도가 치는 해변', description: 'Ocean waves on a sandy beach' },
  { id: 'rainy-window', label: '비 내리는 창가', description: 'Raindrops on window glass' },
  { id: 'library-old', label: '고서들이 있는 도서관', description: 'Ancient library with old books' },
  { id: 'neon-street', label: '네온사인이 빛나는 밤거리', description: 'Neon-lit night street' },
  { id: 'cherry-blossom', label: '벚꽃이 흩날리는 공원', description: 'Cherry blossoms falling in park' },
  { id: 'desert-night', label: '별이 가득한 사막의 밤', description: 'Starry night in the desert' },
  { id: 'train-journey', label: '기차 창밖 풍경', description: 'Scenery passing by train window' },
  { id: 'coffee-shop', label: '아늑한 카페 한구석', description: 'Cozy corner of a coffee shop' },
  { id: 'snowy-village', label: '눈 덮인 작은 마을', description: 'Snow-covered small village' },
  { id: 'underwater', label: '신비로운 바다 속', description: 'Mysterious underwater world' },
];

export const moodOptions: Option[] = [
  { id: 'sad-nostalgic', label: '슬프고 아련한', description: 'Sad and nostalgic feelings' },
  { id: 'calm-peaceful', label: '잔잔하고 편안한', description: 'Calm and peaceful mood' },
  { id: 'happy-energetic', label: '기분 좋고 활기찬', description: 'Happy and energetic vibe' },
  { id: 'mysterious-dreamy', label: '신비롭고 몽환적인', description: 'Mysterious and dreamy atmosphere' },
  { id: 'romantic-warm', label: '로맨틱하고 따뜻한', description: 'Romantic and warm feeling' },
  { id: 'dark-dramatic', label: '어둡고 극적인', description: 'Dark and dramatic tone' },
  { id: 'melancholic', label: '우울하고 쓸쓸한', description: 'Melancholic and lonely mood' },
  { id: 'hopeful-bright', label: '희망적이고 밝은', description: 'Hopeful and bright feeling' },
  { id: 'anxious-tense', label: '불안하고 긴장된', description: 'Anxious and tense atmosphere' },
  { id: 'playful-fun', label: '장난스럽고 재미있는', description: 'Playful and fun mood' },
  { id: 'epic-heroic', label: '웅장하고 영웅적인', description: 'Epic and heroic feeling' },
  { id: 'contemplative', label: '사색적이고 깊이 있는', description: 'Contemplative and deep mood' },
  { id: 'magical-ethereal', label: '마법같고 신비로운', description: 'Magical and ethereal atmosphere' },
  { id: 'cozy-intimate', label: '포근하고 친밀한', description: 'Cozy and intimate feeling' },
];

export const durationOptions: Option[] = [
  { id: '30', label: '30초', description: 'Short intro or teaser' },
  { id: '60', label: '1분', description: 'Perfect for social media' },
  { id: '120', label: '2분', description: 'Standard background music' },
  { id: '180', label: '3분', description: 'Full length composition' },
  { id: '300', label: '5분', description: 'Extended listening' },
];

export const genreOptions: Option[] = [
  { id: 'lofi', label: '로파이', description: 'Chill lo-fi hip hop beats' },
  { id: 'ambient', label: '앰비언트', description: 'Atmospheric ambient sounds' },
  { id: 'jazz', label: '재즈', description: 'Smooth jazz melodies' },
  { id: 'newage', label: '뉴에이지', description: 'New age meditation music' },
  { id: 'classical', label: '클래식', description: 'Classical orchestral pieces' },
  { id: 'synthwave', label: '신스웨이브', description: 'Retro synthwave vibes' },
  { id: 'folk', label: '포크', description: 'Acoustic folk melodies' },
  { id: 'cinematic', label: '시네마틱', description: 'Movie soundtrack style' },
  { id: 'chillhop', label: '칠합', description: 'Chill hop with smooth beats' },
  { id: 'neo-soul', label: '네오 소울', description: 'Modern neo-soul grooves' },
  { id: 'indie', label: '인디', description: 'Independent alternative sound' },
  { id: 'bossa-nova', label: '보사노바', description: 'Brazilian bossa nova rhythm' },
  { id: 'minimal', label: '미니멀', description: 'Minimalist composition' },
  { id: 'world', label: '월드뮤직', description: 'World music fusion' },
  { id: 'auto', label: '잘 모르겠어요', description: 'Let AI choose the best genre' },
];

export const useCaseOptions: Option[] = [
  { id: 'study-focus', label: '공부/집중용', description: 'Music for studying and concentration' },
  { id: 'sleep', label: '수면 전 음악', description: 'Relaxing music before sleep' },
  { id: 'vlog-intro', label: '유튜브 브이로그 인트로', description: 'YouTube vlog introduction' },
  { id: 'background', label: '영상 배경 음악', description: 'Video background music' },
  { id: 'meditation', label: '명상/요가', description: 'Meditation and yoga music' },
  { id: 'workout', label: '운동/헬스', description: 'Workout and fitness music' },
  { id: 'cafe-ambient', label: '카페 배경음악', description: 'Ambient music for cafes' },
  { id: 'reading', label: '독서용', description: 'Music for reading books' },
  { id: 'cooking', label: '요리할 때', description: 'Music while cooking' },
  { id: 'walking', label: '산책/드라이브용', description: 'Music for walking or driving' },
  { id: 'podcast-intro', label: '팟캐스트 인트로', description: 'Podcast introduction music' },
  { id: 'presentation', label: '프레젠테이션용', description: 'Background for presentations' },
  { id: 'therapy', label: '힐링/치유용', description: 'Therapeutic and healing music' },
  { id: 'creative-work', label: '창작활동용', description: 'Music for creative work' },
];

export const instrumentOptions: Option[] = [
  { id: 'piano-strings', label: '피아노 + 스트링', description: 'Piano with string ensemble' },
  { id: 'guitar-synth', label: '기타 + 신디사이저', description: 'Guitar with synthesizers' },
  { id: 'orchestra-choir', label: '오케스트라 + 합창', description: 'Full orchestra with choir' },
  { id: 'flute-harp', label: '플루트 + 하프', description: 'Flute with harp accompaniment' },
  { id: 'electronic', label: '일렉트로닉', description: 'Electronic synthesized sounds' },
  { id: 'acoustic', label: '어쿠스틱', description: 'Acoustic instruments only' },
  { id: 'violin-cello', label: '바이올린 + 첼로', description: 'String quartet arrangement' },
  { id: 'saxophone-jazz', label: '색소폰 + 재즈밴드', description: 'Saxophone with jazz ensemble' },
  { id: 'ethnic-drums', label: '민족악기 + 드럼', description: 'Ethnic instruments with percussion' },
  { id: 'ambient-pads', label: '앰비언트 패드', description: 'Atmospheric synthesizer pads' },
  { id: 'vocal-harmonies', label: '보컬 하모니', description: 'Layered vocal harmonies' },
  { id: 'woodwinds', label: '목관악기', description: 'Woodwind instruments ensemble' },
  { id: 'brass-section', label: '금관악기', description: 'Brass section arrangement' },
  { id: 'hand-percussion', label: '핸드퍼커션', description: 'Hand drums and percussion' },
];