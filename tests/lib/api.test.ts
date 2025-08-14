// Mock the entire API module
jest.mock('../../src/lib/api', () => ({
  evaluationAPI: {
    createStudentTest: jest.fn(),
    getStudentTest: jest.fn(),
    getStudentTestByUserId: jest.fn(),
  }
}))

import { evaluationAPI } from '../../src/lib/api'

describe('API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('evaluationAPI', () => {
    it('should create student test', async () => {
      const mockData = {
        user_id: 'test-user-id',
        answers: [1, 2, 1],
        personality_type: 'INTJ',
        recommended_universities: ['uni1', 'uni2'],
        gpt_summary: 'Test summary'
      }

      const expectedResponse = { id: 'test-id', ...mockData }
      
      // Mock the API call
      (evaluationAPI.createStudentTest as jest.Mock).mockResolvedValue(expectedResponse)

      // Test the function
      const result = await evaluationAPI.createStudentTest(mockData)
      
      expect(result).toEqual(expectedResponse)
      expect(evaluationAPI.createStudentTest).toHaveBeenCalledWith(mockData)
    })

    it('should get student test by ID', async () => {
      const testId = 'test-test-id'
      const expectedResponse = { 
        id: testId, 
        user_id: 'test-user-id',
        answers: [1, 2, 1],
        personality_type: 'INTJ',
        recommended_universities: ['uni1', 'uni2'],
        gpt_summary: 'Test summary'
      }
      
      // Mock the API call
      (evaluationAPI.getStudentTest as jest.Mock).mockResolvedValue(expectedResponse)

      // Test the function
      const result = await evaluationAPI.getStudentTest(testId)
      
      expect(result).toEqual(expectedResponse)
      expect(evaluationAPI.getStudentTest).toHaveBeenCalledWith(testId)
    })

    it('should get student tests by user ID', async () => {
      const userId = 'test-user-id'
      const expectedResponse = [
        { 
          id: 'test1', 
          user_id: userId,
          answers: [1, 2, 1],
          personality_type: 'INTJ',
          recommended_universities: ['uni1'],
          gpt_summary: 'Test summary 1'
        },
        { 
          id: 'test2', 
          user_id: userId,
          answers: [2, 1, 2],
          personality_type: 'ENTP',
          recommended_universities: ['uni2'],
          gpt_summary: 'Test summary 2'
        }
      ]
      
      // Mock the API call
      (evaluationAPI.getStudentTestByUserId as jest.Mock).mockResolvedValue(expectedResponse)

      // Test the function
      const result = await evaluationAPI.getStudentTestByUserId(userId)
      
      expect(result).toEqual(expectedResponse)
      expect(evaluationAPI.getStudentTestByUserId).toHaveBeenCalledWith(userId)
    })
  })
})