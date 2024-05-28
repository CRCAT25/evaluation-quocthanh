export class DTOStatus {
    id: number
    status: string
}

export const dataStatus: DTOStatus[] = [
    {
        id: 0,
        status: "Đang soạn thảo"
    },
    {
        id: 1,
        status: "Gửi duyệt"
    },
    {
        id: 2,
        status: "Đã duyệt"
    },
    {
        id: 3,
        status: "Ngưng đánh giá"
    },
    {
        id: 4,
        status: "Trả về"
    }
]

export const dataStage: DTOStatus[] = [
    {
      id: 5,
      status: 'Hoàn tất'
    },
    {
      id: 6,
      status: "Hoàn tất phúc khảo"
    },
    {
      id: 7,
      status: "Đang diễn ra"
    },
    {
      id: 8,
      status: "Chưa mở"
    },
    {
      id: 9,
      status: "Kết thúc thi"
    },
    {
      id: 10,
      status: "Đang phúc khảo"
    },
    {
      id: 11,
      status: "Yêu cầu phúc khảo"
    },
    {
      id: 12,
      status: "Phúc khảo"
    },
  ]