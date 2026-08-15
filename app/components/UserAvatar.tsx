// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Download, Loader2 } from "lucide-react"; // ← ADD THIS LINE

// interface UserAvatarProps {
//   userId: string;
//   name: string;
//   size?: number;
//   className?: string;
//   showDownload?: boolean;
//   onDownload?: (userId: string, name: string) => void; // ← ADD THIS
// }

// const getImageFromIndexedDB = async (userId: string): Promise<string | null> => {
//   return new Promise((resolve) => {
//     const request = indexedDB.open('UserImagesDB', 1);
    
//     request.onsuccess = (event) => {
//       const db = (event.target as IDBOpenDBRequest).result;
//       const transaction = db.transaction(['images'], 'readonly');
//       const store = transaction.objectStore('images');
//       const getRequest = store.get(userId);
      
//       getRequest.onsuccess = () => resolve(getRequest.result?.imageData || null);
//       getRequest.onerror = () => resolve(null);
//     };
//     request.onerror = () => resolve(null);
//   });
// };

// export default function UserAvatar({ 
//   userId, 
//   name, 
//   size = 40,
//   className = "",
//   showDownload = false,
//   onDownload, // ← ADD THIS
// }: UserAvatarProps) {
//   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [downloading, setDownloading] = useState(false);

//   useEffect(() => {
//     const loadAvatar = async () => {
//       if (!userId) {
//         setLoading(false);
//         return;
//       }
//       const url = await getImageFromIndexedDB(userId);
//       setAvatarUrl(url);
//       setLoading(false);
//     };
//     loadAvatar();
//   }, [userId]);

//   const handleDownload = async () => {
//     if (!avatarUrl) return;
    
//     setDownloading(true);
//     try {
//       if (onDownload) {
//         onDownload(userId, name);
//       } else {
//         const link = document.createElement('a');
//         link.href = avatarUrl;
//         link.download = `${name.replace(/\s+/g, '_')}_avatar.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       }
//     } catch (error) {
//       console.error("Error downloading:", error);
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const initials = name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

//   if (loading) {
//     return (
//       <div 
//         className={`animate-pulse rounded-full bg-gray-200 ${className}`}
//         style={{ width: size, height: size }}
//       />
//     );
//   }

//   return (
//     <div className="flex items-center gap-2">
//       {avatarUrl ? (
//         <>
//           <Image
//             src={avatarUrl}
//             alt={name}
//             width={size}
//             height={size}
//             className={`rounded-full object-cover ${className}`}
//           />
//           {showDownload && (
//             <button
//               onClick={handleDownload}
//               disabled={downloading}
//               className="rounded-full bg-cyan-500 p-1 text-white hover:bg-cyan-600 transition-colors disabled:opacity-50"
//               title="Download avatar"
//             >
//               {downloading ? (
//                 <Loader2 size={14} className="animate-spin" />
//               ) : (
//                 <Download size={14} />
//               )}
//             </button>
//           )}
//         </>
//       ) : (
//         <div 
//           className={`flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold ${className}`}
//           style={{ width: size, height: size, fontSize: size * 0.4 }}
//         >
//           {initials}
//         </div>
//       )}
//     </div>
//   );
// }




















// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Download, Loader2 } from "lucide-react";

// interface UserAvatarProps {
//   userId: string;
//   name: string;
//   size?: number;
//   className?: string;
//   showDownload?: boolean;
//   onDownload?: (userId: string, name: string) => void;
// }

// const getImageFromLocalStorage = (userId: string): string | null => {
//   try {
//     return localStorage.getItem(`avatar_${userId}`);
//   } catch (error) {
//     console.error('Error getting image from localStorage:', error);
//     return null;
//   }
// };

// export default function UserAvatar({ 
//   userId, 
//   name, 
//   size = 40,
//   className = "",
//   showDownload = false,
//   onDownload,
// }: UserAvatarProps) {
//   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [downloading, setDownloading] = useState(false);

//   useEffect(() => {
//     if (!userId) {
//       setLoading(false);
//       return;
//     }
//     const url = getImageFromLocalStorage(userId);
//     setAvatarUrl(url);
//     setLoading(false);
//   }, [userId]);

//   const handleDownload = async () => {
//     if (!avatarUrl) return;
    
//     setDownloading(true);
//     try {
//       if (onDownload) {
//         onDownload(userId, name);
//       } else {
//         const link = document.createElement('a');
//         link.href = avatarUrl;
//         link.download = `${name.replace(/\s+/g, '_')}_avatar.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       }
//     } catch (error) {
//       console.error("Error downloading:", error);
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const initials = name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

//   if (loading) {
//     return (
//       <div 
//         className={`animate-pulse rounded-full bg-gray-200 ${className}`}
//         style={{ width: size, height: size }}
//       />
//     );
//   }

//   return (
//     <div className="flex items-center gap-2">
//       {avatarUrl ? (
//         <>
//           <Image
//             src={avatarUrl}
//             alt={name}
//             width={size}
//             height={size}
//             className={`rounded-full object-cover ${className}`}
//           />
//           {showDownload && (
//             <button
//               onClick={handleDownload}
//               disabled={downloading}
//               className="rounded-full bg-cyan-500 p-1 text-white hover:bg-cyan-600 transition-colors disabled:opacity-50"
//               title="Download avatar"
//             >
//               {downloading ? (
//                 <Loader2 size={14} className="animate-spin" />
//               ) : (
//                 <Download size={14} />
//               )}
//             </button>
//           )}
//         </>
//       ) : (
//         <div 
//           className={`flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold ${className}`}
//           style={{ width: size, height: size, fontSize: size * 0.4 }}
//         >
//           {initials}
//         </div>
//       )}
//     </div>
//   );
// }




























"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Loader2 } from "lucide-react";

interface UserAvatarProps {
  userId: string;
  name: string;
  size?: number;
  className?: string;
  showDownload?: boolean;
  onDownload?: (userId: string, name: string) => void;
}

// Fetches avatar from the API using the session cookie
const fetchAvatar = async (userId: string): Promise<string | null> => {
  try {
    const response = await fetch(`/api/user/avatar?userId=${userId}`, {
      credentials: 'include',
    });
    if (!response.ok) return null;
    const result = await response.json();
    return result.data?.avatar || null;
  } catch (error) {
    console.error('Error fetching avatar:', error);
    return null;
  }
};

export default function UserAvatar({
  userId,
  name,
  size = 40,
  className = "",
  showDownload = false,
  onDownload,
}: UserAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const loadAvatar = async () => {
      const url = await fetchAvatar(userId);
      setAvatarUrl(url);
      setLoading(false);
    };
    loadAvatar();
  }, [userId]);

  const handleDownload = async () => {
    if (!avatarUrl) return;

    setDownloading(true);
    try {
      if (onDownload) {
        onDownload(userId, name);
      } else {
        const link = document.createElement('a');
        link.href = avatarUrl;
        link.download = `${name.replace(/\s+/g, '_')}_avatar.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading:", error);
    } finally {
      setDownloading(false);
    }
  };

  const initials = name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

  if (loading) {
    return (
      <div
        className={`animate-pulse rounded-full bg-gray-200 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      {avatarUrl ? (
        <>
          <Image
            src={avatarUrl}
            alt={name}
            width={size}
            height={size}
            className={`rounded-full object-cover ${className}`}
          />
          {showDownload && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="rounded-full bg-cyan-500 p-1 text-white hover:bg-cyan-600 transition-colors disabled:opacity-50"
              title="Download avatar"
            >
              {downloading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
            </button>
          )}
        </>
      ) : (
        <div
          className={`flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold ${className}`}
          style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}