import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export function PricingUpgrade({
	handleSubscribe,
	handleFreeClick,
	isPremiumLoading,
	isFreeLoading,
}: {
	handleSubscribe: any
	handleFreeClick: any
	isPremiumLoading: boolean
	isFreeLoading: boolean
}) {
	const [selectedPlan, setSelectedPlan] = useState("Monthly")

	const plans = [
		{
			name: "Prepsy Plus",
			price: 29,
			originalPrice: null,
			period: "month",
			color: "blue",
			features: [
				"1,000+ practice problems",
				"26+ learning modules", 
				"AP score tracker",
				"Vocab tool & reading passages",
				"Custom study plan",
				"5 mock exams",
				"Challenge problems & video explanations"
			],
			footer: "& all upcoming features",
			buttonText: "Choose Plan"
		},
		{
			name: "Prepsy Pro", 
			price: 49,
			originalPrice: 100,
			period: "month",
			color: "blue",
			popular: true,
			features: [
				"Everything in Prepsy Plus",
				"2 weekly live hour-long seminars with over 20+ hours of recordings",
				"Comprehensive demos, math, english, and reading courses with over 85+ videos",
				"250 personalized Q&A sessions with Professor Coco, your state-of-the-art AI tutor",
				"Generate 250 unique practice questions",
				"Access to premium community"
			],
			footer: "& all upcoming features",
			buttonText: "Choose Plan"
		},
		{
			name: "Prepsy Premium",
			price: 99,
			originalPrice: 200,
			period: "month", 
			color: "black",
			features: [
				"Everything in Prepsy Pro",
				"1-on-1 daily tutoring with a top 1% scoring private tutor",
				"Message the tutor anytime, anywhere",
				"Schedule check-in calls every week with your tutor",
				"500 chat sessions with Professor Coco",
				"Generate 500 unique practice questions"
			],
			footer: "& all upcoming features",
			buttonText: "Choose Plan"
		}
	]

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="text-2xl font-bold">
						<span className="text-green-600">prep</span><span className="text-blue-600">sy :)</span>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2 text-sm">
							<span className="text-yellow-500">★★★★★</span>
							<span className="font-medium">4.9</span>
							<span className="text-gray-600">Reviews</span>
						</div>
						<Button 
							variant="outline" 
							className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
						>
							Profile
						</Button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-6 py-12">
				{/* Title */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Subscription Plans
					</h1>
					<p className="text-lg text-gray-600">
						Choose the best plan that fits your needs.
					</p>
				</div>

				{/* Plan Toggle */}
				<div className="flex justify-center mb-12">
					<div className="flex items-center gap-4 bg-gray-100 rounded-full p-1">
						<Badge variant="destructive" className="bg-red-500 text-white text-xs px-2 py-1">
							-50%
						</Badge>
						{["Yearly", "3 Months", "Monthly", "Weekly"].map((plan) => (
							<button
								key={plan}
								onClick={() => setSelectedPlan(plan)}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
									selectedPlan === plan
										? "bg-blue-600 text-white"
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								{plan}
							</button>
						))}
					</div>
				</div>

				{/* Pricing Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
					{plans.map((plan, index) => (
						<div
							key={plan.name}
							className={`relative rounded-2xl border-2 p-6 ${
								plan.color === "blue"
									? "border-blue-500 bg-blue-50"
									: plan.color === "black"
									? "border-black bg-gray-50"
									: "border-gray-200 bg-white"
							}`}
						>
							{/* Header Badge */}
							<div className="text-center mb-6">
								<div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
									index === 0 
										? "bg-blue-600 text-white"
										: index === 1
										? "bg-blue-600 text-white"
										: "bg-black text-white"
								}`}>
									{index === 0 ? "Platform Access" : index === 1 ? "+ Seminars, Courses, & AI" : "+ Tutoring"}
								</div>
							</div>

							{/* Plan Name */}
							<h3 className="text-2xl font-bold text-center mb-4">
								{plan.name}
							</h3>

							{/* Price */}
							<div className="text-center mb-6">
								<div className="flex items-center justify-center gap-2">
									{plan.originalPrice && (
										<span className="text-2xl text-gray-400 line-through">
											${plan.originalPrice}
										</span>
									)}
									<span className="text-4xl font-bold">
										${plan.price}
									</span>
									<span className="text-gray-600">/{plan.period}</span>
								</div>
							</div>

							{/* Features */}
							<div className="space-y-3 mb-8">
								{plan.features.map((feature, featureIndex) => (
									<div key={featureIndex} className="flex items-start gap-3">
										<Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
										<span className="text-sm text-gray-700">{feature}</span>
									</div>
								))}
								<div className="flex items-start gap-3">
									<span className="text-sm text-gray-500 italic">{plan.footer}</span>
								</div>
							</div>

							{/* Button */}
							<Button
								onClick={() => handleSubscribe("monthly")}
								disabled={isPremiumLoading}
								className={`w-full py-3 rounded-lg font-medium transition-colors ${
									plan.color === "black"
										? "bg-black text-white hover:bg-gray-800"
										: "bg-blue-600 text-white hover:bg-blue-700"
								}`}
							>
								{isPremiumLoading ? "Loading..." : plan.buttonText}
							</Button>
						</div>
					))}
				</div>
			</main>
		</div>
	)
}
