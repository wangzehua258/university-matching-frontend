'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, ChevronRight, Sparkles } from 'lucide-react';
import { evaluationAPI } from '@/lib/api';

interface Question {
  id: number;
  text: string;
  options: {
    value: string;
    text: string;
    description: string;
  }[];
}

const StudentTestStart = () => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      text: "在团队项目中，你更倾向于：",
      options: [
        {
          value: "leader",
          text: "担任领导者",
          description: "喜欢组织协调，制定计划"
        },
        {
          value: "supporter",
          text: "支持配合",
          description: "乐于协助他人，注重团队和谐"
        },
        {
          value: "innovator",
          text: "提出创意",
          description: "善于思考新想法，推动创新"
        },
        {
          value: "executor",
          text: "执行落实",
          description: "专注细节，确保任务完成"
        }
      ]
    },
    {
      id: 2,
      text: "面对新挑战时，你的第一反应是：",
      options: [
        {
          value: "excited",
          text: "兴奋期待",
          description: "把挑战视为成长机会"
        },
        {
          value: "cautious",
          text: "谨慎分析",
          description: "先了解情况，制定策略"
        },
        {
          value: "confident",
          text: "自信应对",
          description: "相信自己有能力解决"
        },
        {
          value: "collaborative",
          text: "寻求合作",
          description: "希望与他人一起面对"
        }
      ]
    },
    {
      id: 3,
      text: "你更喜欢的学习方式是：",
      options: [
        {
          value: "hands-on",
          text: "实践操作",
          description: "通过动手实践来学习"
        },
        {
          value: "theoretical",
          text: "理论学习",
          description: "先理解概念和原理"
        },
        {
          value: "discussion",
          text: "讨论交流",
          description: "与他人讨论和分享想法"
        },
        {
          value: "research",
          text: "自主研究",
          description: "独立探索和发现"
        }
      ]
    },
    {
      id: 4,
      text: "在社交场合，你通常是：",
      options: [
        {
          value: "outgoing",
          text: "外向活跃",
          description: "主动与人交流，活跃气氛"
        },
        {
          value: "observant",
          text: "观察倾听",
          description: "善于观察，倾听他人"
        },
        {
          value: "selective",
          text: "选择性社交",
          description: "与志同道合的人深入交流"
        },
        {
          value: "helpful",
          text: "乐于助人",
          description: "关注他人需求，提供帮助"
        }
      ]
    },
    {
      id: 5,
      text: "对于未来规划，你更看重：",
      options: [
        {
          value: "stability",
          text: "稳定发展",
          description: "希望有稳定的职业发展路径"
        },
        {
          value: "exploration",
          text: "探索发现",
          description: "愿意尝试不同领域和机会"
        },
        {
          value: "impact",
          text: "社会影响",
          description: "希望自己的工作能产生积极影响"
        },
        {
          value: "achievement",
          text: "个人成就",
          description: "追求个人目标和卓越表现"
        }
      ]
    },
    {
      id: 6,
      text: "在压力下，你倾向于：",
      options: [
        {
          value: "systematic",
          text: "系统分析",
          description: "冷静分析问题，制定解决方案"
        },
        {
          value: "creative",
          text: "创意突破",
          description: "寻找创新方法，跳出常规思维"
        },
        {
          value: "collaborative",
          text: "团队合作",
          description: "寻求他人支持，共同解决问题"
        },
        {
          value: "persistent",
          text: "坚持不懈",
          description: "保持专注，逐步推进"
        }
      ]
    },
    {
      id: 7,
      text: "你更喜欢的校园环境是：",
      options: [
        {
          value: "urban",
          text: "城市校园",
          description: "位于城市中心，交通便利"
        },
        {
          value: "rural",
          text: "乡村校园",
          description: "环境优美，远离喧嚣"
        },
        {
          value: "diverse",
          text: "多元文化",
          description: "国际学生多，文化多元"
        },
        {
          value: "traditional",
          text: "传统氛围",
          description: "历史悠久，学术氛围浓厚"
        }
      ]
    },
    {
      id: 8,
      text: "对于专业选择，你更倾向于：",
      options: [
        {
          value: "practical",
          text: "实用导向",
          description: "选择就业前景好的专业"
        },
        {
          value: "passion",
          text: "兴趣导向",
          description: "选择自己真正感兴趣的专业"
        },
        {
          value: "interdisciplinary",
          text: "跨学科",
          description: "喜欢多学科交叉的专业"
        },
        {
          value: "research",
          text: "研究导向",
          description: "选择有研究深度的专业"
        }
      ]
    }
  ];

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 完成测评，提交到API
      await submitTest(newAnswers);
    }
  };

  const submitTest = async (finalAnswers: string[]) => {
    try {
      setLoading(true);
      
      // 准备提交数据
      const testData = {
        answers: finalAnswers,
        questions: questions.map(q => ({
          id: q.id,
          text: q.text,
          options: q.options
        }))
      };

      // 调用API创建测评
      const result = await evaluationAPI.createStudentTest(testData);
      
      // 跳转到结果页面，传递测评ID
      router.push(`/student-test/result?id=${result.id}`);
    } catch (error) {
      console.error('提交测评失败:', error);
      alert('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在分析您的人格类型...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">学生人格测评</h1>
          </div>
          <p className="text-gray-600">通过8个简单问题，了解你的学习风格和择校偏好</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              问题 {currentQuestion + 1} / {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              完成度 {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentQ.text}
            </h2>
            <p className="text-gray-600">请选择最符合你的选项</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-purple-500 flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {option.text}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className={`px-6 py-2 rounded-md font-medium ${
                currentQuestion === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              上一题
            </button>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-500">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 提示：选择最符合你真实想法的选项，没有标准答案
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentTestStart; 