import { Layout, VideoItem, VideoItems } from "@components";
import { useTriggerScrollBottom } from "@hooks";
import { videoStore } from "@stores/video-store";
import { useEffect, useRef } from "react";
import { Loader } from "semantic-ui-react";

export function Home() {
    const { fetchVideo, fetchNextPage, isDone, isLoading, isEnd, videos } = videoStore();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchVideo()
    }, [])


    useTriggerScrollBottom(ref, () => {
        if (!isEnd) {
            fetchNextPage()
        }
    }, [isEnd])
    return <Layout
        className="py-20"
    >
        <VideoItems ref={ref}>
            {videos.map(video => (
                <VideoItem key={video.id} videoInfo={video} />
            ))}
            {isLoading && !isDone && <Loader active inline='centered' />}
        </VideoItems>

    </Layout>
}