import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import {
  Box,
  Container,
  Grid,
  IconButton,
  Link,
  Typography,
} from '@mui/material'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Pagination, Autoplay } from 'swiper/modules'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import { useQuery } from 'urql'

import { KnowledgeHubResourcesQuery } from '@app/generated/graphql'

import { KNOWLEDGE_HUB_RESOURCES_QUERY } from '../../queries/knowledge-hub-resources'
import {
  ResourceCard,
  ResourceCardSkeleton,
} from '../ResourceCard/ResourceCard'

import 'swiper/css'
import 'swiper/css/pagination'

import './swiper-styles.css'

export const ResourcesCarousel = () => {
  const [{ data, fetching, error }] = useQuery<KnowledgeHubResourcesQuery>({
    query: KNOWLEDGE_HUB_RESOURCES_QUERY,
  })

  const { t } = useTranslation('pages', {
    keyPrefix: 'welcome.resources-carousel',
  })

  const swiperRef = useRef<SwiperClass>()

  if (error) {
    return null
  }

  return (
    <Container sx={{ my: 10 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h4"
          fontFamily="Poppins"
          color="primary"
          fontWeight={500}
          mb={3}
        >
          {t('title')}
        </Typography>
        <Typography color="grey.600">
          <Link
            href={`${import.meta.env.VITE_KNOWLEDGE_HUB_URL}/collections/all`}
          >
            {t('view-all-button-text')}
          </Link>
        </Typography>
      </Box>

      <Box position="relative">
        {fetching ? (
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <ResourceCardSkeleton />
            </Grid>
            <Grid item xs={4}>
              <ResourceCardSkeleton />
            </Grid>
            <Grid item xs={4}>
              <ResourceCardSkeleton />
            </Grid>
          </Grid>
        ) : (
          <>
            <Swiper
              spaceBetween={30}
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              className="resources-carousel"
              onSwiper={(swiper: SwiperClass) => (swiperRef.current = swiper)}
              autoplay
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  slidesPerGroup: 1,
                },
                640: {
                  slidesPerView: 2,
                  slidesPerGroup: 2,
                },
                1024: {
                  slidesPerView: 3,
                  slidesPerGroup: 3,
                },
              }}
            >
              {data?.knowledgeHubResources?.resources.map(resource => (
                <SwiperSlide key={resource.id}>
                  <ResourceCard resource={resource} />
                </SwiperSlide>
              ))}
            </Swiper>
            <IconButton
              onClick={() => swiperRef.current?.slidePrev()}
              sx={{
                width: 50,
                height: 50,
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-60px)',
                left: '-25px',
                zIndex: 100,
                backgroundColor: 'white',
                borderRadius: '50%',
                border: 1,
                borderColor: 'grey.300',
                ':hover': {
                  bgcolor: 'white',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <IconButton
              onClick={() => swiperRef.current?.slideNext()}
              sx={{
                width: 50,
                height: 50,
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-60px)',
                right: '-25px',
                zIndex: 100,
                backgroundColor: 'white',
                borderRadius: '50%',
                border: 1,
                borderColor: 'grey.300',
                ':hover': {
                  bgcolor: 'white',
                },
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </>
        )}
      </Box>
    </Container>
  )
}
