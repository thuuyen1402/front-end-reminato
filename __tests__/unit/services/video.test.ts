import { getError } from '@utils/error'
import api from "@utils/api";
import { faker } from '@faker-js/faker';
import { afterEach, describe, expect, it, vi } from 'vitest';
import videoService from '@services/video';
import { fakeVideoData, fakeVideoSharing } from '__mocks__/fake/video';


describe('Service auth sign in', () => {

    afterEach(() => {
        vi.restoreAllMocks()
    })


    it('Get list videos', async () => {
        const resolveData = {
            data: fakeVideoData.slice(0, 4),
            pagination: {
                cursor: fakeVideoData[4].id,
                isEnd: false
            }
        };

        vi.mocked(api.get).mockResolvedValue({
            data: resolveData
        })


        try {
            const res = await videoService.videoGetVideos({
                query: {}
            })

            expect(res.data).toMatchObject(resolveData)
        } catch (err) {
            expect(getError(err)).toBeTypeOf("string")
        }
    });

    it('Get list videos with query', async () => {
        const query = {
            limit: "4",
            cursor: undefined
        }
        const resolveData = {
            data: fakeVideoData.slice(0, 4),
            pagination: {
                cursor: fakeVideoData[4].id,
                isEnd: +query.limit
            }
        }

        vi.mocked(api.get).mockResolvedValue({
            data: resolveData
        })

        try {
            const res = await videoService.videoGetVideos({
                query
            })

            expect(res.data).toMatchObject(resolveData)
        } catch (err) {
            expect(getError(err)).toBeTypeOf("string")
        }
    });

    it("Sharing video", async () => {
        vi.mocked(api.post).mockResolvedValue({
            data: {
                data: fakeVideoSharing
            }
        })

        try {

            const res = await videoService.videoSharing({
                data: {
                    url: faker.internet.url()
                }
            })

            expect(res.data.data).toMatchObject(fakeVideoSharing)
        } catch (err) {
            expect(getError(err)).toBeTypeOf("string")
        }
    })
    it("Vote video", async () => {
        vi.mocked(api.put).mockResolvedValue({
            data: {
                message: "Vote video success",
            }
        })

        try {

            const res = await videoService.videoVoteVideo({
                body: {
                    type: faker.string.fromCharacters(["up", "down"]) as "up" | "down"
                },
                params: {
                    id: faker.string.uuid()
                }
            })

            expect(res.data.message).toBe("Vote video success")
        } catch (err) {
            expect(getError(err)).toBeTypeOf("string")
        }
    })
})

