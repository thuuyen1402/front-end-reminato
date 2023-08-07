import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from "@testing-library/react";
import api from '@utils/api';
import { fakeVideoData } from '__mocks__/fake/video';
import { videoStore } from '@stores/video-store';


describe('Libs/store Video store', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('List videos', async () => {
        const resolveData = {
            data: fakeVideoData.slice(0, 4),
            pagination: {
                cursor: fakeVideoData[4].id,
                isEnd: false
            }
        };
        vi.mocked(api.get).mockResolvedValueOnce({
            data: resolveData
        })

        const { result } = renderHook(() => videoStore());
        await act(async () => {
            await result.current.fetchVideo();
        })

        expect(result.current).toMatchObject({
            isLoading: false,
            isDone: true,
            videos: fakeVideoData.slice(0, 4),
            isEnd: resolveData.pagination.isEnd,
            cursorId: resolveData.pagination.cursor
        });

        it('Next video items', async () => {
    
            
            await act(async () => {
                await result.current.fetchVideo();
            })
    
            // Set up for next fetch
            const resolveNextData = {
                data: fakeVideoData.slice(4, 8),
                pagination: {
                    cursor: fakeVideoData[8].id,
                    isEnd: false
                }
            };

            vi.mocked(api.get).mockResolvedValue({
                data: resolveNextData
            })
    
            await act(async () => {
                await result.current.fetchNextPage();
            })
    
    
            expect(result.current).toMatchObject({
                isLoading: false,
                isDone: true,
                videos: fakeVideoData.slice(0, 8),
                isEnd: resolveNextData.pagination.isEnd,
                cursorId: resolveNextData.pagination.cursor
            });
        });
    });

    


})



