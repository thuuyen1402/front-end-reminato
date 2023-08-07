import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { Toast } from "react-hot-toast";

export const fakeOptionToast: Toast = {
    id: faker.string.uuid(),
    ariaProps: { role: "status", "aria-live": "polite" },
    createdAt: dayjs().unix(),
    pauseDuration: 5000,
    message: "",
    type: "custom",
    visible: true,
}