import serviceVideo from '@services/video';
import { waitResolve } from '@utils/utils';
import { create } from 'zustand'

type VideoStore = {
    videos: VideoShareModelType[];
    isLoading: boolean;
    isDone: boolean;
    cursorId: string | undefined;
    limit: string;
    isEnd?: boolean;
    fetchVideo: () => Promise<void>;
    fetchNextPage: () => Promise<void>;
};

export const videoStore = create<VideoStore>()((set, get) => ({
    videos: [],
    limit: "5",
    isLoading: true,
    isEnd: false,
    isDone: false,
    cursorId: undefined,
    fetchVideo: async () => {
        const state = { ...get() };
        state.isLoading = true;
        state.isDone = false;
        set(state)
        try {
            const res = await serviceVideo.videoGetVideos({
                query: {}
            })
            const data = res.data.data as VideoShareModelType[];
            const pagination = res.data.pagination as Pagination;
            state.videos = data;
            state.isEnd = pagination.isEnd;
            state.cursorId = pagination.cursor
        }

        catch (err) {
            // eslint-disable-next-line no-empty
        } finally {
            state.isLoading = false;
            state.isDone = true;
        }
        set(state)
    },
    fetchNextPage: async () => {
        const state = { ...get() };
        state.isLoading = true;
        state.isDone = false;
        set(state)
        try {
            const res = await serviceVideo.videoGetVideos({
                query: {
                    cursor: state.cursorId,
                    limit: state.limit
                },
            })
            await waitResolve(1500)
            const data = res.data.data as VideoShareModelType[];
            const pagination = res.data.pagination as Pagination;
            state.videos = state.videos.concat(data);
            state.isEnd = pagination.isEnd;
            state.cursorId = pagination.cursor
        }
        catch (err) {
            // eslint-disable-next-line no-empty
        } finally {
            state.isLoading = false;
            state.isDone = true;
        }
        set(state)
    }
}));
