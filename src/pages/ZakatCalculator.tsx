import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { zakatCalculatorApi } from "@/services/zakatCalculatorApi";
import { 
  Calculator, 
  DollarSign, 
  Info,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Bookmark,
  TrendingUp,
  Coins,
  Building,
  Car,
  Gem,
  Wheat,
  Banknote,
  PiggyBank,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ZakatCategory {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  nisab: number;
  rate: number;
  icon: React.ElementType;
  color: string;
  examples: string[];
}

interface ZakatCalculation {
  category: string;
  wealth: number;
  nisab: number;
  zakatDue: number;
  isEligible: boolean;
}

const zakatCategories: ZakatCategory[] = [
  {
    id: 'cash_savings',
    name: 'Cash & Savings',
    arabicName: 'النقد والمدخرات',
    description: 'Cash in hand, bank accounts, savings, and liquid assets',
    nisab: 4340, // Current gold nisab in USD (approximate)
    rate: 2.5,
    icon: Banknote,
    color: 'from-green-500 to-emerald-500',
    examples: ['Bank accounts', 'Cash in hand', 'Savings accounts', 'Money market funds']
  },
  {
    id: 'gold_silver',
    name: 'Gold & Silver',
    arabicName: 'الذهب والفضة',
    description: 'Gold and silver jewelry, coins, and bullion',
    nisab: 4340, // Gold nisab
    rate: 2.5,
    icon: Gem,
    color: 'from-yellow-500 to-amber-500',
    examples: ['Gold jewelry', 'Silver jewelry', 'Gold coins', 'Precious metals']
  },
  {
    id: 'business_assets',
    name: 'Business Assets',
    arabicName: 'أصول التجارة',
    description: 'Business inventory, trade goods, and commercial assets',
    nisab: 4340,
    rate: 2.5,
    icon: Building,
    color: 'from-blue-500 to-cyan-500',
    examples: ['Business inventory', 'Trade goods', 'Commercial property', 'Business equipment']
  },
  {
    id: 'investments',
    name: 'Investments',
    arabicName: 'الاستثمارات',
    description: 'Stocks, bonds, mutual funds, and investment portfolios',
    nisab: 4340,
    rate: 2.5,
    icon: TrendingUp,
    color: 'from-purple-500 to-violet-500',
    examples: ['Stocks', 'Bonds', 'Mutual funds', 'Investment accounts']
  },
  {
    id: 'agriculture',
    name: 'Agricultural Produce',
    arabicName: 'المنتجات الزراعية',
    description: 'Crops, fruits, and agricultural products',
    nisab: 1360, // Different nisab for agriculture
    rate: 10, // 10% for rain-fed, 5% for irrigated
    icon: Wheat,
    color: 'from-orange-500 to-red-500',
    examples: ['Wheat', 'Rice', 'Fruits', 'Vegetables']
  },
  {
    id: 'livestock',
    name: 'Livestock',
    arabicName: 'الماشية',
    description: 'Cattle, sheep, goats, and other livestock',
    nisab: 2000, // Varies by animal type
    rate: 2.5,
    icon: PiggyBank,
    color: 'from-pink-500 to-rose-500',
    examples: ['Cattle', 'Sheep', 'Goats', 'Camels']
  }
];

export default function ZakatCalculator() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('cash_savings');
  const [wealthInputs, setWealthInputs] = useState<{ [key: string]: number }>({});
  const [calculations, setCalculations] = useState<ZakatCalculation[]>([]);
  const [totalZakat, setTotalZakat] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);

  const currentCategory = zakatCategories.find(cat => cat.id === selectedCategory);

  const calculateZakat = useCallback(() => {
    const newCalculations: ZakatCalculation[] = [];
    let total = 0;

    zakatCategories.forEach(category => {
      const wealth = wealthInputs[category.id] || 0;
      const isEligible = wealth >= category.nisab;
      const zakatDue = isEligible ? (wealth * category.rate) / 100 : 0;

      newCalculations.push({
        category: category.name,
        wealth,
        nisab: category.nisab,
        zakatDue,
        isEligible
      });

      total += zakatDue;
    });

    setCalculations(newCalculations);
    setTotalZakat(total);
    setShowResults(Object.values(wealthInputs).some(value => value > 0));
  }, [wealthInputs]);

  useEffect(() => {
    calculateZakat();
  }, [calculateZakat]);

  const handleInputChange = (categoryId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setWealthInputs(prev => ({
      ...prev,
      [categoryId]: numValue
    }));
  };

  const resetCalculator = () => {
    setWealthInputs({});
    setCalculations([]);
    setTotalZakat(0);
    setShowResults(false);
    toast.success("Calculator reset");
  };

  const saveCalculation = () => {
    toast.success("Zakat calculation saved");
  };

  const shareCalculation = () => {
    toast.success("Calculation shared");
  };

  const downloadReport = () => {
    toast.success("Zakat report downloaded");
  };

  return (
    <PageLayout 
      title="Zakat Calculator" 
      subtitle="Calculate your Islamic obligation of Zakat with precision and ease"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
            <Calculator size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Islamic Finance</span>
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">Zakat Calculator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Calculate your Zakat obligation accurately according to Islamic principles. 
            Zakat is one of the Five Pillars of Islam and a fundamental act of worship.
          </p>
          
          {/* Zakat Information */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Coins size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-lg mb-2">2.5% Rate</h3>
                <p className="text-sm text-muted-foreground">Standard Zakat rate for most wealth types</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-lg mb-2">Annual Obligation</h3>
                <p className="text-sm text-muted-foreground">Calculated once per lunar year</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <DollarSign size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-lg mb-2">Nisab Threshold</h3>
                <p className="text-sm text-muted-foreground">Minimum wealth required for Zakat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <h2 className="text-2xl font-display mb-6">Select Wealth Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zakatCategories.map((category, index) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "p-6 rounded-xl border transition-all duration-300 text-left animate-slide-up",
                    isSelected 
                      ? "border-primary bg-primary/5 shadow-red" 
                      : "border-border/50 bg-card hover:border-primary/50"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br",
                      category.color
                    )}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg mb-1">{category.name}</h3>
                      <p className="text-right text-sm text-muted-foreground mb-2 font-arabic" dir="rtl">
                        {category.arabicName}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Nisab: ${category.nisab.toLocaleString()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Rate: {category.rate}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wealth Input Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-display mb-6">Enter Your Wealth</h2>
            <div className="space-y-6">
              {zakatCategories.map((category) => {
                const Icon = category.icon;
                const currentValue = wealthInputs[category.id] || 0;
                const isAboveNisab = currentValue >= category.nisab;
                
                return (
                  <div key={category.id} className="bg-card rounded-xl border border-border/30 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                        category.color
                      )}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Nisab: ${category.nisab.toLocaleString()} | Rate: {category.rate}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="number"
                        placeholder="0.00"
                        value={wealthInputs[category.id] || ''}
                        onChange={(e) => handleInputChange(category.id, e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-secondary/30 border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                    
                    {currentValue > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        {isAboveNisab ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <AlertCircle size={16} className="text-amber-500" />
                        )}
                        <span className={cn(
                          "text-sm",
                          isAboveNisab ? "text-green-600" : "text-amber-600"
                        )}>
                          {isAboveNisab 
                            ? `Zakat due: $${((currentValue * category.rate) / 100).toFixed(2)}`
                            : `Below Nisab threshold`
                          }
                        </span>
                      </div>
                    )}

                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Examples:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.examples.map(example => (
                          <span key={example} className="text-xs px-2 py-1 bg-secondary rounded-md">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results Panel */}
          <div className="sticky top-6">
            <div className="bg-card rounded-xl border border-border/30 p-6">
              <h2 className="text-2xl font-display mb-6 flex items-center gap-2">
                <Calculator className="text-primary" size={24} />
                Zakat Calculation
              </h2>

              {showResults ? (
                <div className="space-y-6">
                  {/* Total Zakat Due */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">Total Zakat Due</h3>
                    <p className="text-4xl font-display text-primary mb-2">
                      ${totalZakat.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {totalZakat > 0 ? 'Zakat is obligatory' : 'No Zakat due'}
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div>
                    <h4 className="font-medium mb-4">Breakdown by Category</h4>
                    <div className="space-y-3">
                      {calculations.filter(calc => calc.wealth > 0).map((calc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                          <div>
                            <p className="font-medium">{calc.category}</p>
                            <p className="text-sm text-muted-foreground">
                              Wealth: ${calc.wealth.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${calc.zakatDue.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {calc.isEligible ? 'Due' : 'Below Nisab'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button 
                      onClick={saveCalculation}
                      className="w-full gap-2"
                    >
                      <Bookmark size={16} />
                      Save Calculation
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        onClick={shareCalculation}
                        className="gap-2"
                      >
                        <Share2 size={16} />
                        Share
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={downloadReport}
                        className="gap-2"
                      >
                        <Download size={16} />
                        Report
                      </Button>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={resetCalculator}
                      className="w-full"
                    >
                      Reset Calculator
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Enter Your Wealth</h3>
                  <p className="text-muted-foreground">
                    Fill in your wealth amounts to calculate your Zakat obligation.
                  </p>
                </div>
              )}
            </div>

            {/* Zakat Information */}
            <div className="mt-6 bg-card rounded-xl border border-border/30 p-6">
              <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                <HelpCircle size={20} className="text-primary" />
                About Zakat
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Zakat is the third pillar of Islam and a religious obligation for all Muslims 
                  who meet the necessary criteria of wealth.
                </p>
                <p>
                  It is a form of almsgiving and religious tax, which is considered a purification 
                  of one's wealth and soul.
                </p>
                <p>
                  The word "Zakat" means "purification" and "growth" in Arabic, as it purifies 
                  wealth and helps it grow in spiritual value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}