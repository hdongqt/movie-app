import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import loadingImage from '@/Assets/Loading/loading.gif';

interface MovieWatchProps {
    urlVideo: string;
}
const MovieWatch: React.FC<MovieWatchProps> = ({ urlVideo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const isCheckM3U8 = urlVideo.endsWith('.m3u8');
    return (
        <>
            {isCheckM3U8 && (
                <ReactPlayer
                    key={Math.random()}
                    url={urlVideo}
                    controls
                    width={'100%'}
                    height={'100%'}
                />
            )}
            {!isCheckM3U8 && (
                <>
                    {isLoading && (
                        <div className="h-full w-full flex items-center justify-center">
                            <img
                                src={loadingImage}
                                className="max-w-52 block"
                            />
                        </div>
                    )}
                    <iframe
                        onLoad={() => setIsLoading(false)}
                        style={{
                            height: '100%',
                            width: '100%',
                            maxHeight: '100%',
                            visibility: isLoading ? 'hidden' : 'visible'
                        }}
                        src={urlVideo}
                    ></iframe>
                </>
            )}
        </>
    );
};
export default MovieWatch;
