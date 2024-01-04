import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionSummary,
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  ModuleGroupsQuery,
  ModuleGroupsQueryVariables,
} from '@app/generated/graphql'
import { QUERY as GetModuleGroups } from '@app/queries/modules/get-module-groups'
import { Course } from '@app/types'
import { LoadingStatus, getSWRLoadingStatus } from '@app/util'

import { submodulesCount } from './utils'

type Props = {
  course: Course
}

export const ICMOverview: React.FC<React.PropsWithChildren<Props>> = ({
  course,
}: Props) => {
  const { t } = useTranslation()
  const [{ data: modulesDataResponse, error: moduleDataError }] = useQuery<
    ModuleGroupsQuery,
    ModuleGroupsQueryVariables
  >({
    query: GetModuleGroups,
    variables: {
      level: course.level as unknown as Course_Level_Enum,
      courseDeliveryType:
        course.deliveryType as unknown as Course_Delivery_Type_Enum,
      reaccreditation: course.reaccreditation,
      go1Integration: Boolean(course.go1Integration),
    },
  })

  const modulesData = useMemo(
    () =>
      modulesDataResponse?.groups.filter(
        group => (group?.duration?.aggregate?.sum?.duration ?? 0) > 0
      ),
    [modulesDataResponse]
  )
  const modulesLoadingStatus = getSWRLoadingStatus(modulesData, moduleDataError)

  const [usedModules, setUsedModules] = useState<string[]>([])

  useEffect(() => {
    const modulesInCourse = course.moduleGroupIds.map(
      ({ module }) => module.moduleGroup.id
    )

    setUsedModules(modulesInCourse)
  }, [course.moduleGroupIds])
  return (
    <>
      {modulesLoadingStatus === LoadingStatus.ERROR && (
        <Alert severity="error" variant="filled">
          {t('internal-error')}
        </Alert>
      )}
      {modulesLoadingStatus === LoadingStatus.FETCHING && (
        <Box display="flex" margin="auto">
          <CircularProgress sx={{ m: 'auto' }} size={64} />
        </Box>
      )}

      {modulesData?.map(item =>
        usedModules.includes(item.id) ? (
          <Accordion key={item.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ width: { sm: '100%', md: '75%', lg: '50%' } }}
            >
              <Box display="flex" alignItems="center">
                <Checkbox
                  defaultChecked={true}
                  disabled={true}
                  sx={{ marginRight: 2 }}
                />
                <Typography variant="body1">{item.name}</Typography>
                <Typography variant="body2" ml={1}>
                  {t('areas', {
                    count:
                      submodulesCount(item.modules) > 0
                        ? submodulesCount(item.modules)
                        : item.modules.length,
                  })}
                </Typography>
              </Box>
            </AccordionSummary>

            <Container>
              {item.modules.map(module => (
                <Box key={module.id} ml={4} my={1} mt={1}>
                  <Typography variant="body1" color="grey.700">
                    {module.name}
                  </Typography>
                  {module.submodules?.length > 0 &&
                    module.submodules.map(m => (
                      <Typography key={m.name} mb={1.5} ml={3} mt={1}>
                        {m.name}
                      </Typography>
                    ))}
                </Box>
              ))}
            </Container>
          </Accordion>
        ) : null
      )}
    </>
  )
}
