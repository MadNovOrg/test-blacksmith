import { ReactComponent as CloseIcon } from './close.svg'
import { ReactComponent as SupervisorIcon } from './supervisor.svg'
import { ReactComponent as BurgerIcon } from './burger.svg'
import { ReactComponent as ArrowDownIcon } from './arrow-down.svg'
import { ReactComponent as PersonIcon } from './person.svg'
import { ReactComponent as ChevronDownIcon } from './chevron-down.svg'
import { ReactComponent as AddPhotoIcon } from './add-photo.svg'
import { ReactComponent as MoodHappyIcon } from './mood-happy.svg'
import { ReactComponent as TagIcon } from './tag.svg'
import { ReactComponent as SchoolIcon } from './school.svg'
import { ReactComponent as ChatBubbleIcon } from './chat-bubble.svg'
import { ReactComponent as ChevronUpIcon } from './chevron-up.svg'
import { ReactComponent as LockIcon } from './lock.svg'
import { ReactComponent as CalenderIcon } from './calender.svg'
import { ReactComponent as ClipboardIcon } from './clipboard.svg'
import { ReactComponent as LinkIcon } from './link.svg'
import { ReactComponent as ArrowRightIcon } from './arrow-right.svg'
import { ReactComponent as MailIcon } from './mail.svg'
import { ReactComponent as ExpandIcon } from './expand.svg'
import { ReactComponent as MoodSadIcon } from './mood-sad.svg'
import { ReactComponent as BellIcon } from './bell.svg'
import { ReactComponent as WarningIcon } from './warning.svg'
import { ReactComponent as MicIcon } from './mic.svg'
import { ReactComponent as ZoomInIcon } from './zoom-in.svg'
import { ReactComponent as LightbulbIcon } from './lightbulb.svg'
import { ReactComponent as ZoomOutIcon } from './zoom-out.svg'
import { ReactComponent as RailIcon } from './rail.svg'
import { ReactComponent as AddLocationIcon } from './add-location.svg'
import { ReactComponent as StarIcon } from './star.svg'
import { ReactComponent as PlusCircleIcon } from './plus_circle.svg'
import { ReactComponent as UnlockIcon } from './unlock.svg'
import { ReactComponent as ComputerIcon } from './computer.svg'
import { ReactComponent as ClockIcon } from './clock.svg'
import { ReactComponent as PhoneIcon } from './phone.svg'
import { ReactComponent as CarIcon } from './car.svg'
import { ReactComponent as MicOffIcon } from './mic-off.svg'
import { ReactComponent as ArrowUpIcon } from './arrow-up.svg'
import { ReactComponent as ArrowLeftIcon } from './arrow-left.svg'
import { ReactComponent as CloudIcon } from './cloud.svg'
import { ReactComponent as FolderIcon } from './folder.svg'
import { ReactComponent as AlarmIcon } from './alarm.svg'
import { ReactComponent as BookmarkCollectionIcon } from './bookmark-collection.svg'
import { ReactComponent as LogoColor } from './logo-color.svg'
import { ReactComponent as KeyboardArrowRightIcon } from './keyboard-arrow-right.svg'
import { ReactComponent as CheckmarkIcon } from './checkmark.svg'
import { ReactComponent as PDFIcon } from './pdf.svg'
import { ReactComponent as BooksIcon } from './books.svg'
import { ReactComponent as ExitIcon } from './exit.svg'
import { ReactComponent as MoreHorizIcon } from './more-horiz.svg'
import { ReactComponent as BlankIcon } from './blank.svg'

const icons = {
  close: CloseIcon,
  burger: BurgerIcon,
  'arrow-down': ArrowDownIcon,
  person: PersonIcon,
  'chevron-down': ChevronDownIcon,
  'add-photo': AddPhotoIcon,
  'mood-happy': MoodHappyIcon,
  tag: TagIcon,
  'chat-bubble': ChatBubbleIcon,
  'chevron-up': ChevronUpIcon,
  lock: LockIcon,
  calender: CalenderIcon,
  clipboard: ClipboardIcon,
  link: LinkIcon,
  'arrow-right': ArrowRightIcon,
  mail: MailIcon,
  expand: ExpandIcon,
  'mood-sad': MoodSadIcon,
  bell: BellIcon,
  warning: WarningIcon,
  mic: MicIcon,
  'zoom-in': ZoomInIcon,
  lightbulb: LightbulbIcon,
  'zoom-out': ZoomOutIcon,
  rail: RailIcon,
  'add-location': AddLocationIcon,
  star: StarIcon,
  plus_circle: PlusCircleIcon,
  unlock: UnlockIcon,
  computer: ComputerIcon,
  clock: ClockIcon,
  phone: PhoneIcon,
  car: CarIcon,
  'mic-off': MicOffIcon,
  'arrow-up': ArrowUpIcon,
  'arrow-left': ArrowLeftIcon,
  cloud: CloudIcon,
  folder: FolderIcon,
  alarm: AlarmIcon,
  'bookmark-collection': BookmarkCollectionIcon,
  supervisor: SupervisorIcon,
  school: SchoolIcon,
  'logo-color': LogoColor,
  'keyboard-arrow-right': KeyboardArrowRightIcon,
  checkmark: CheckmarkIcon,
  pdf: PDFIcon,
  books: BooksIcon,
  exit: ExitIcon,
  'more-horiz': MoreHorizIcon,
  blank: BlankIcon,
}

export default icons

export type AppIcons = keyof typeof icons
