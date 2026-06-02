import React, { useState } from 'react';
import { 
  VideoCameraIcon, SparklesIcon, ArrowPathIcon, ArrowDownTrayIcon,
  PhotoIcon, UserGroupIcon, MapIcon
} from '@heroicons/react/24/outline';

export default function VidToolsClone() {
  const [title, setTitle] = useState('Video Mới');
  const [script, setScript] = useState('bạn hãy tạo một bộ phim pokemon săn quái vật');
  const [scenes, setScenes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState({}); 
  const [selectedDurations, setSelectedDurations] = useState({});

  // Hàm tạo Storyboard ảnh tĩnh mẫu
  const handleCreateStoryboard = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockScenes = [
        { id: 'SCENE_1', title: 'PHÂN CẢNH 1', image: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=500', desc: 'Bối cảnh rừng nguyên sinh u ám...', video: null },
        { id: 'SCENE_2', title: 'PHÂN CẢNH 2', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500', desc: 'Quái vật khổng lồ xuất hiện...', video: null }
      ];
      setScenes(mockScenes);
      setIsLoading(false);
    }, 1000);
  };

  const handleDurationChange = (sceneId, duration) => {
    setSelectedDurations(prev => ({ ...prev, [sceneId]: duration }));
  };

  // Hàm gọi API Backend Python để tạo và nối dài Video (8s / 15s / 30s)
  const handleGenerateVideo = async (sceneId, imageUrl, promptText) => {
    const duration = selectedDurations[sceneId] || 8;
    setVideoLoading(prev => ({ ...prev, [sceneId]: true }));

    try {
      // ĐÂY LÀ NƠI KẾT NỐI ĐẾN SERVER PYTHON (SAU NÀY SẼ ĐỔI THÀNH LINK RENDER)
      const response = await fetch('http://localhost:8000/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scene_id: sceneId,
          image_url: imageUrl,
          prompt: promptText,
          duration: Number(duration)
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setScenes(prevScenes => 
          prevScenes.map(scene => 
            scene.id === sceneId ? { ...scene, video: data.video_url } : scene
          )
        );
      }
    } catch (err) {
      alert("Lỗi kết nối server khi tạo video!");
    } finally {
      setVideoLoading(prev => ({ ...prev, [sceneId]: false }));
    }
  };

  return (
    <div className="flex h-screen bg-[#121212] text-gray-200 font-sans overflow-hidden">
      
      {/* SIDEBAR BÊN TRÁI */}
      <div className="w-64 bg-[#1a1a1a] border-r border-gray-800 flex flex-col justify-between">
        <div className="p-4 space-y-6">
          <div className="flex items-center space-x-2 px-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold text-black">VH</div>
            <span className="font-bold text-lg tracking-wider text-white">VIDEOHATO</span>
          </div>
          
          <nav className="space-y-1">
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-gray-800 text-white font-medium text-sm">
              <SparklesIcon className="w-5 h-5 text-green-400" />
              <span>Tạo video AI từ kịch bản</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 text-sm">
              <PhotoIcon className="w-5 h-5" />
              <span>Hình ảnh</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 text-sm">
              <VideoCameraIcon className="w-5 h-5" />
              <span>Video</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 text-sm">
              <UserGroupIcon className="w-5 h-5" />
              <span>Nhân vật</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 text-sm">
              <MapIcon className="w-5 h-5" />
              <span>Cảnh</span>
            </a>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">Thu gọn</div>
      </div>

      {/* KHU VỰC CHÍNH */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-14 bg-[#1a1a1a] border-b border-gray-800 flex items-center justify-between px-6">
          <div className="text-sm font-medium text-gray-400">Dự án: <span className="text-white">Tạo video AI từ kịch bản</span></div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded">Nâng cấp</button>
            <button className="px-4 py-1.5 bg-gray-800 text-white text-xs font-bold rounded border border-gray-700">Xong</button>
          </div>
        </header>

        {/* CỘT CẤU HÌNH & LƯỚI HIỂN THỊ */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* PANEL CẤU HÌNH */}
          <div className="w-80 bg-[#161616] border-r border-gray-800 p-4 overflow-y-auto space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Tiêu đề Video</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#222] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Nội dung kịch bản</label>
              <textarea 
                rows="4"
                value={script} 
                onChange={(e) => setScript(e.target.value)}
                className="w-full bg-[#222] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 resize-none"
              />
            </div>

            <div className="pt-4 border-t border-gray-800 space-y-3">
              <button 
                onClick={handleCreateStoryboard}
                disabled={isLoading}
                className="w-full py-2.5 bg-white text-black font-bold text-sm rounded-lg hover:bg-gray-200 transition flex items-center justify-center space-x-2"
              >
                <SparklesIcon className="w-5 h-5 text-indigo-600" />
                <span>{isLoading ? 'Đang phân tích...' : 'Tạo Storyboard'}</span>
              </button>
              
              <button className="w-full py-2 bg-gray-800 text-gray-300 font-medium text-xs rounded-lg flex items-center justify-center space-x-2 border border-gray-700">
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>Tải Ảnh & Video (.zip)</span>
              </button>
            </div>
          </div>

          {/* KHU VỰC HIỂN THỊ PHÂN CẢNH */}
          <div className="flex-1 bg-[#121212] p-6 overflow-y-auto">
            {scenes.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-gray-500">
                <div>
                  <SparklesIcon className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                  <p className="text-sm">Nhập kịch bản ở thanh bên trái và bấm <span className="text-gray-300 font-semibold">"Tạo Storyboard"</span> để bắt đầu.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full content-start">
                {scenes.map((scene) => (
                  <div key={scene.id} className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="px-4 py-2 bg-[#222] flex justify-between items-center border-b border-gray-800">
                        <span className="text-xs font-bold text-amber-500">{scene.title}</span>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-gray-400">Thời lượng:</span>
                          <select 
                            value={selectedDurations[scene.id] || 8}
                            onChange={(e) => handleDurationChange(scene.id, e.target.value)}
                            className="bg-[#333] text-xs text-white border border-gray-600 rounded px-1 py-0.5 focus:outline-none"
                          >
                            <option value={8}>8 giây</option>
                            <option value={15}>15 giây</option>
                            <option value={30}>30 giây</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="relative aspect-video bg-black flex items-center justify-center">
                        {videoLoading[scene.id] ? (
                          <div className="text-center text-sm text-amber-400 font-medium">
                            <SparklesIcon className="w-8 h-8 mx-auto animate-spin mb-2" />
                            Đang render & nối chuỗi video AI...
                          </div>
                        ) : scene.video ? (
                          <video src={scene.video} controls autoPlay loop className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <img src={scene.image} alt={scene.title} className="w-full h-full object-cover opacity-70" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <button 
                                onClick={() => handleGenerateVideo(scene.id, scene.image, scene.desc)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full flex items-center space-x-2 text-sm shadow-xl"
                              >
                                <VideoCameraIcon className="w-4 h-4" />
                                <span>Tạo Video ({selectedDurations[scene.id] || 8}s)</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-[#161616] border-t border-gray-800">
                      <p className="text-xs text-gray-400">{scene.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}