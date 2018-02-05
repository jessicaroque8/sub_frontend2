import { Sendee } from '/sendee.model'
export class SubRequest {
  id: number;
  user_id: number;
  group_id: number;
  class_id_mb: number;
  class_name: string;
  start_date_time: string;
  end_date_time: string;
  note: string;
  awaiting_confirm: boolean;
  closed: boolean;
  created_at: string;
  updated_at: string;
  sender_img: string;
  sendees: Array<Sendee>;
}
