import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import BookOutlinedIcon from '@mui/icons-material/BookOutlined'
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined'
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined'
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined'
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined'
import React, { ReactNode } from 'react'

const iconByResourceArea: Record<string, ReactNode> = {
  topic: <TopicOutlinedIcon color="success" />,
  auto_stories: <AutoStoriesOutlinedIcon color="warning" />,
  play_circle: <PlayCircleOutlinedIcon color="error" />,
  edit_note: <AppRegistrationIcon color="tertiary" />,
  psychology_alt: <PsychologyAltOutlinedIcon color="info" />,
  import_contacts: <ImportContactsOutlinedIcon color="success" />,
  sticky_note_2: <StickyNote2OutlinedIcon color="error" />,
  diversity_3: <Diversity3OutlinedIcon color="warning" />,
  local_library: <LocalLibraryOutlinedIcon color="tertiary" />,
  lightbulb: <LightbulbOutlinedIcon color="info" />,
  book: <BookOutlinedIcon color="success" />,
}

export type ResourceIconType = keyof typeof iconByResourceArea

type Props = {
  icon: string | undefined | null
}

export const ResourceAreaIcon = ({ icon }: Props) => {
  return icon ? (
    <>{iconByResourceArea[icon]}</>
  ) : (
    <TopicOutlinedIcon color="success" />
  )
}
