import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

const PaymentsPage: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [institutionalPlans, setInstitutionalPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
    fetchInstitutionalPlans();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payments/methods');
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const fetchInstitutionalPlans = async () => {
    try {
      const response = await fetch('/api/payments/institutional');
      if (response.ok) {
        const data = await response.json();
        setInstitutionalPlans(data.data);
      }
    } catch (error) {
      console.error('Error fetching institutional plans:', error);
    }
  };

  const handleSubscription = async () => {
    if (!selectedPlan || !selectedMethod) return;

    setLoading(true);
    try {
      const response = await fetch('/api/payments/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: selectedPlan, paymentMethod: selectedMethod }),
      });

      if (response.ok) {
        alert('Subscription created successfully!');
      } else {
        alert('Error creating subscription');
      }
    } catch (error) {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handlePayForCourse = async () => {
    if (!courseId || !selectedMethod) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/payments/courses/${courseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: selectedMethod }),
      });

      if (response.ok) {
        alert('Payment successful!');
      } else {
        alert('Error processing payment');
      }
    } catch (error) {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Payments & Subscriptions</h1>

      <Tabs defaultValue="methods" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="courses">Pay for Course</TabsTrigger>
          <TabsTrigger value="institutional">Institutional</TabsTrigger>
        </TabsList>

        <TabsContent value="methods">
          <Card>
            <CardHeader>
              <CardTitle>Available Payment Methods</CardTitle>
              <CardDescription>Choose your preferred payment method.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border rounded-lg p-4 text-center">
                    <div className="text-4xl mb-2">{method.icon}</div>
                    <h3 className="font-semibold">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    <Button
                      variant={selectedMethod === method.id ? 'default' : 'outline'}
                      onClick={() => setSelectedMethod(method.id)}
                      className="mt-2"
                    >
                      {method.isActive ? 'Select' : 'Unavailable'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Create Subscription</CardTitle>
              <CardDescription>Subscribe to access premium features.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="plan-select">Select Plan</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Monthly (50,000 FCFA)</SelectItem>
                    <SelectItem value="YEARLY">Yearly (500,000 FCFA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSubscription} disabled={loading} className="w-full">
                {loading ? 'Processing...' : 'Create Subscription'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Pay for a Course</CardTitle>
              <CardDescription>Purchase access to a specific course.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="course-id">Course ID</Label>
                <Input
                  id="course-id"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  placeholder="Enter course ID"
                />
              </div>
              <Button onClick={handlePayForCourse} disabled={loading} className="w-full">
                {loading ? 'Processing...' : 'Pay for Course'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="institutional">
          <Card>
            <CardHeader>
              <CardTitle>Institutional Licensing</CardTitle>
              <CardDescription>Plans for schools and institutions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {institutionalPlans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                    <p className="text-lg font-bold">{plan.price.toLocaleString()} FCFA</p>
                    <ul className="list-disc pl-5 mt-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-sm">{feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentsPage;
