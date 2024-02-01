import { extend } from 'lodash-es'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import {
  getRequiredAssistants,
  TrainerRatioCriteria,
} from '@app/util/trainerRatio/trainerRatio.icm'

describe('trainerRatio utils', () => {
  describe('getRequiredTrainers', () => {
    let criteria: TrainerRatioCriteria
    beforeEach(() => {
      criteria = {
        courseLevel: Course_Level_Enum.Level_1,
        type: Course_Type_Enum.Open,
        deliveryType: Course_Delivery_Type_Enum.Virtual,
        reaccreditation: false,
        maxParticipants: 0,
        hasSeniorOrPrincipalLeader: false,
      }
    })

    describe('Level 1', () => {
      beforeEach(() => (criteria.courseLevel = Course_Level_Enum.Level_1))

      describe('Indirect course type, created by trainer', () => {
        beforeEach(() => {
          criteria.deliveryType = Course_Delivery_Type_Enum.F2F
          criteria.isTrainer = true
          criteria.type = Course_Type_Enum.Indirect
        })

        it('participants below threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 4 }))
          ).toEqual({
            min: 1,
            max: 1,
          })
        })
        it('participants equal to threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 24 }))
          ).toEqual({
            min: 1,
            max: 2,
          })
        })
        it('participants above threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 27 }))
          ).toEqual({
            min: 2,
            max: 2,
          })
        })
        it('participants on next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 36 }))
          ).toEqual({
            min: 2,
            max: 3,
          })
        })
        it('participants above next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 39 }))
          ).toEqual({
            min: 3,
            max: 3,
          })
        })
      })

      describe('Reaccreditation', () => {
        beforeEach(() => (criteria.reaccreditation = true))

        // 0 assistants up to 12, then 1 additional per every 12 above 12

        it('participants below threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 4 }))
          ).toEqual({
            min: 0,
            max: 0,
          })
        })
        it('participants equal to threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 12 }))
          ).toEqual({
            min: 0,
            max: 1,
          })
        })
        it('participants above threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 13 }))
          ).toEqual({
            min: 1,
            max: 1,
          })
        })
        it('participants on next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 24 }))
          ).toEqual({
            min: 1,
            max: 2,
          })
        })
        it('participants above next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 25 }))
          ).toEqual({
            min: 2,
            max: 2,
          })
        })
      })

      describe('Open', () => {
        beforeEach(() => (criteria.type = Course_Type_Enum.Open))

        // 0 assistants up to 24, then 1 additional per every 12 above 24

        it('participants below threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 4 }))
          ).toEqual({
            min: 0,
            max: 0,
          })
        })
        it('participants equal to threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 24 }))
          ).toEqual({
            min: 0,
            max: 1,
          })
        })
        it('participants above threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 25 }))
          ).toEqual({
            min: 1,
            max: 1,
          })
        })
        it('participants on next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 36 }))
          ).toEqual({
            min: 1,
            max: 2,
          })
        })
        it('participants above next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 37 }))
          ).toEqual({
            min: 2,
            max: 2,
          })
        })
      })

      describe('Closed/Indirect', () => {
        beforeEach(() => (criteria.type = Course_Type_Enum.Closed))

        describe('senior/principal trainer assigned', () => {
          beforeEach(() => (criteria.hasSeniorOrPrincipalLeader = true))

          // 0 assistants for up to 12, then 1 additional per each additional 12

          it('participants below threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 4 })
              )
            ).toEqual({
              min: 0,
              max: 0,
            })
          })
          it('participants equal to threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 12 })
              )
            ).toEqual({
              min: 0,
              max: 1,
            })
          })
          it('participants above threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 13 })
              )
            ).toEqual({
              min: 1,
              max: 1,
            })
          })
          it('participants on next increment threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 24 })
              )
            ).toEqual({
              min: 1,
              max: 2,
            })
          })
          it('participants above next increment threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 25 })
              )
            ).toEqual({
              min: 2,
              max: 2,
            })
          })
        })

        describe('Virtual', () => {
          beforeEach(
            () => (criteria.deliveryType = Course_Delivery_Type_Enum.Virtual)
          )

          // 1 assistant for up to 24, then 1 additional per each additional 12

          it('participants below threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 4 })
              )
            ).toEqual({
              min: 1,
              max: 1,
            })
          })
          it('participants equal to threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 24 })
              )
            ).toEqual({
              min: 1,
              max: 2,
            })
          })
          it('participants above threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 25 })
              )
            ).toEqual({
              min: 2,
              max: 2,
            })
          })
          it('participants on next increment threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 36 })
              )
            ).toEqual({
              min: 2,
              max: 3,
            })
          })
          it('participants above next increment threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 37 })
              )
            ).toEqual({
              min: 3,
              max: 3,
            })
          })
        })

        describe('F2F', () => {
          beforeEach(
            () => (criteria.deliveryType = Course_Delivery_Type_Enum.F2F)
          )

          // 1 assistant for up to 12, then 1 additional per each additional 12

          it('participants below threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 4 })
              )
            ).toEqual({
              min: 1,
              max: 1,
            })
          })
          it('participants equal to threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 24 })
              )
            ).toEqual({
              min: 1,
              max: 2,
            })
          })
          it('participants above threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 25 })
              )
            ).toEqual({
              min: 2,
              max: 2,
            })
          })
          it('participants on next increment threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 36 })
              )
            ).toEqual({
              min: 2,
              max: 3,
            })
          })
          it('participants above next increment threshold', () => {
            expect(
              getRequiredAssistants(
                extend({}, criteria, { maxParticipants: 37 })
              )
            ).toEqual({
              min: 3,
              max: 3,
            })
          })
        })
      })
    })

    describe('Level 2', () => {
      beforeEach(() => (criteria.courseLevel = Course_Level_Enum.Level_2))

      describe('Indirect course type, created by trainer', () => {
        beforeEach(() => {
          criteria.deliveryType = Course_Delivery_Type_Enum.F2F
          criteria.isTrainer = true
          criteria.type = Course_Type_Enum.Indirect
        })

        it('participants below threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 4 }))
          ).toEqual({
            min: 1,
            max: 1,
          })
        })
        it('participants equal to threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 24 }))
          ).toEqual({
            min: 1,
            max: 2,
          })
        })
        it('participants above threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 27 }))
          ).toEqual({
            min: 2,
            max: 2,
          })
        })
        it('participants on next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 36 }))
          ).toEqual({
            min: 2,
            max: 3,
          })
        })
        it('participants above next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 39 }))
          ).toEqual({
            min: 3,
            max: 3,
          })
        })
      })

      describe('Reaccreditation', () => {
        beforeEach(() => (criteria.reaccreditation = true))

        // 0 assistants up to 12, then 1 additional per every 12 above 12

        it('participants below threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 4 }))
          ).toEqual({
            min: 0,
            max: 0,
          })
        })
        it('participants equal to threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 12 }))
          ).toEqual({
            min: 0,
            max: 1,
          })
        })
        it('participants above threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 13 }))
          ).toEqual({
            min: 1,
            max: 1,
          })
        })
        it('participants on next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 24 }))
          ).toEqual({
            min: 1,
            max: 2,
          })
        })
        it('participants above next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 25 }))
          ).toEqual({
            min: 2,
            max: 2,
          })
        })
      })

      describe('no senior/principal trainer assigned', () => {
        beforeEach(() => (criteria.hasSeniorOrPrincipalLeader = false))

        // 1 assistant for up to 24, then 1 additional per each additional 12

        it('participants below threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 4 }))
          ).toEqual({
            min: 1,
            max: 1,
          })
        })
        it('participants equal to threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 24 }))
          ).toEqual({
            min: 1,
            max: 2,
          })
        })
        it('participants above threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 25 }))
          ).toEqual({
            min: 2,
            max: 2,
          })
        })
        it('participants on next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 36 }))
          ).toEqual({
            min: 2,
            max: 3,
          })
        })
        it('participants above next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 37 }))
          ).toEqual({
            min: 3,
            max: 3,
          })
        })
      })

      describe('senior/principal trainer assigned', () => {
        beforeEach(() => (criteria.hasSeniorOrPrincipalLeader = true))

        // 0 assistants up to 12, then 1 additional per every 12 above 12

        it('participants below threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 4 }))
          ).toEqual({
            min: 0,
            max: 0,
          })
        })
        it('participants equal to threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 12 }))
          ).toEqual({
            min: 0,
            max: 1,
          })
        })
        it('participants above threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 13 }))
          ).toEqual({
            min: 1,
            max: 1,
          })
        })
        it('participants on next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 24 }))
          ).toEqual({
            min: 1,
            max: 2,
          })
        })
        it('participants above next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 25 }))
          ).toEqual({
            min: 2,
            max: 2,
          })
        })
      })
    })

    describe('Advanced Modules', () => {
      beforeEach(() => (criteria.courseLevel = Course_Level_Enum.Advanced))

      describe('no senior/principal trainer assigned', () => {
        beforeEach(() => (criteria.hasSeniorOrPrincipalLeader = false))

        // 1 assistant for up to 16, then 1 additional per each additional 8

        it('participants below threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 4 }))
          ).toEqual({
            min: 1,
            max: 1,
          })
        })
        it('participants equal to threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 16 }))
          ).toEqual({
            min: 1,
            max: 2,
          })
        })
        it('participants above threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 17 }))
          ).toEqual({
            min: 2,
            max: 2,
          })
        })
        it('participants on next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 24 }))
          ).toEqual({
            min: 2,
            max: 3,
          })
        })
        it('participants above next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 25 }))
          ).toEqual({
            min: 3,
            max: 3,
          })
        })
      })

      describe('senior/principal trainer assigned', () => {
        beforeEach(() => (criteria.hasSeniorOrPrincipalLeader = true))

        // 0 assistants up to 8, then 1 additional per every 8 above 8

        it('participants below threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 4 }))
          ).toEqual({
            min: 0,
            max: 0,
          })
        })
        it('participants equal to threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 8 }))
          ).toEqual({
            min: 0,
            max: 1,
          })
        })
        it('participants above threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 9 }))
          ).toEqual({
            min: 1,
            max: 1,
          })
        })
        it('participants on next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 16 }))
          ).toEqual({
            min: 1,
            max: 2,
          })
        })
        it('participants above next increment threshold', () => {
          expect(
            getRequiredAssistants(extend({}, criteria, { maxParticipants: 17 }))
          ).toEqual({
            min: 2,
            max: 2,
          })
        })
      })
    })

    describe('Intermediate Trainer', () => {
      beforeEach(
        () => (criteria.courseLevel = Course_Level_Enum.IntermediateTrainer)
      )

      // 1 assistant up to 24, then 1 additional per every 12 above 24

      it('participants below threshold', () => {
        expect(
          getRequiredAssistants(extend({}, criteria, { maxParticipants: 4 }))
        ).toEqual({
          min: 1,
          max: 1,
        })
      })
      it('participants equal to threshold', () => {
        expect(
          getRequiredAssistants(extend({}, criteria, { maxParticipants: 24 }))
        ).toEqual({
          min: 1,
          max: 2,
        })
      })
      it('participants above threshold', () => {
        expect(
          getRequiredAssistants(extend({}, criteria, { maxParticipants: 25 }))
        ).toEqual({
          min: 2,
          max: 2,
        })
      })
      it('participants on next increment threshold', () => {
        expect(
          getRequiredAssistants(extend({}, criteria, { maxParticipants: 36 }))
        ).toEqual({
          min: 2,
          max: 3,
        })
      })
      it('participants above next increment threshold', () => {
        expect(
          getRequiredAssistants(extend({}, criteria, { maxParticipants: 37 }))
        ).toEqual({
          min: 3,
          max: 3,
        })
      })
    })

    describe('Advanced Trainer', () => {
      beforeEach(
        () => (criteria.courseLevel = Course_Level_Enum.AdvancedTrainer)
      )

      // 1 assistant up to 24, then 1 additional per every 12 above 24

      it('participants below threshold', () => {
        expect(
          getRequiredAssistants(extend({}, criteria, { maxParticipants: 4 }))
        ).toEqual({
          min: 1,
          max: 1,
        })
      })
      it('participants equal to threshold', () => {
        expect(
          getRequiredAssistants(extend({}, criteria, { maxParticipants: 24 }))
        ).toEqual({
          min: 1,
          max: 2,
        })
      })
      it('participants above threshold', () => {
        expect(
          getRequiredAssistants(extend({}, criteria, { maxParticipants: 25 }))
        ).toEqual({
          min: 2,
          max: 2,
        })
      })
      it('participants on next increment threshold', () => {
        expect(
          getRequiredAssistants(extend({}, criteria, { maxParticipants: 36 }))
        ).toEqual({
          min: 2,
          max: 3,
        })
      })
      it('participants above next increment threshold', () => {
        expect(
          getRequiredAssistants(extend({}, criteria, { maxParticipants: 37 }))
        ).toEqual({
          min: 3,
          max: 3,
        })
      })
    })
  })
})
