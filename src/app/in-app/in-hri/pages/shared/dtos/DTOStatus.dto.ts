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

export const dataActions: {id: number, action: string, classIcon: string}[] = [
  {
    id: 0,
    action: 'Thiết lập đợt đánh giá',
    classIcon: 'k-i-pencil'
  },
  {
    id: 1,
    action: 'Gửi duyệt',
    classIcon: 'k-i-redo'
  },
  {
    id: 2,
    action: 'Phê duyệt',
    classIcon: 'k-i-check-outline'
  },
  {
    id: 3,
    action: 'Ngưng đợt đánh giá',
    classIcon: 'k-i-minus-outline'
  },
  {
    id: 4,
    action: 'Trả về',
    classIcon: 'k-i-undo'
  },
  {
    id: 5,
    action: 'Tính điểm đợt đánh giá',
    classIcon: 'k-i-parameters-byte-array'
  },
  {
    id: 6,
    action: 'Xem chi tiết đợt đánh giá',
    classIcon: 'k-i-track-changes-reject'
  },
  {
    id: 7,
    action: 'Giám sát đợt đánh giá',
    classIcon: 'k-i-eye'
  },
  {
    id: 8,
    action: 'Chấm điểm câu tự luận',
    classIcon: 'k-i-change-manually'
  },
  {
    id: 9,
    action: 'Xóa đợt đánh giá',
    classIcon: 'k-i-trash'
  },
  {
    id: 10,
    action: 'Kết thúc làm bài',
    classIcon: 'k-i-cancel'
  },
  {
    id: 11,
    action: 'Chấm phúc khảo',
    classIcon: 'k-i-track-changes-enable'
  }
]