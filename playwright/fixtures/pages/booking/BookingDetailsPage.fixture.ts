import { BasePage } from '../BasePage.fixture'

export class BookingDetailsPage extends BasePage {
  async goto(id?: string) {
    await super.goto(`registration${id ? `?course_id=${id}&quantity=1` : ''}`)
  }
}
