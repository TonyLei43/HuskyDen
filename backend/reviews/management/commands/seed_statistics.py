from django.core.management.base import BaseCommand
from reviews.models import Department, Course, Professor, Review


class Command(BaseCommand):
    help = 'Seed the database with Statistics (STAT) courses from UW'

    def handle(self, *args, **options):
        self.stdout.write('Seeding Statistics courses...')

        # Create Statistics department
        stat_dept, _ = Department.objects.get_or_create(
            code='STAT',
            defaults={'name': 'Statistics'}
        )

        # Statistics courses - based on typical UW Statistics curriculum
        statistics_courses = [
            {
                'code': 'STAT 220',
                'title': 'Statistical Reasoning',
                'description': 'Introduction to statistical reasoning. Topics include data collection, descriptive statistics, probability, sampling distributions, confidence intervals, hypothesis testing, and regression. Emphasis on statistical literacy and critical thinking.'
            },
            {
                'code': 'STAT 221',
                'title': 'Statistical Concepts and Methods for the Social Sciences',
                'description': 'Statistical methods for social science research. Topics include descriptive statistics, probability, sampling, hypothesis testing, confidence intervals, correlation, regression, and analysis of variance. Applications to social science data.'
            },
            {
                'code': 'STAT 290',
                'title': 'Descriptive and Inferential Statistics',
                'description': 'Introduction to descriptive and inferential statistics. Topics include data visualization, measures of central tendency and variability, probability distributions, sampling, confidence intervals, and hypothesis testing.'
            },
            {
                'code': 'STAT 311',
                'title': 'Elements of Statistical Methods',
                'description': 'Introduction to statistical methods for data analysis. Topics include descriptive statistics, probability, random variables, sampling distributions, estimation, hypothesis testing, correlation, and regression. Applications to real-world problems.'
            },
            {
                'code': 'STAT 340',
                'title': 'Introduction to Statistical Computing',
                'description': 'Introduction to statistical computing using R. Topics include data manipulation, visualization, statistical functions, programming basics, and reproducible research. Emphasis on practical data analysis skills.'
            },
            {
                'code': 'STAT 390',
                'title': 'Statistical Methods in Engineering and Science',
                'description': 'Statistical methods for engineering and science applications. Topics include probability, random variables, sampling distributions, estimation, hypothesis testing, analysis of variance, regression, and experimental design.'
            },
            {
                'code': 'STAT 391',
                'title': 'Probability and Statistics in Computer Science',
                'description': 'Probability and statistics for computer science applications. Topics include discrete and continuous probability, random variables, expectation, variance, common distributions, sampling, estimation, and hypothesis testing. Applications to algorithms and data analysis.'
            },
            {
                'code': 'STAT 394',
                'title': 'Probability I',
                'description': 'Introduction to probability theory. Topics include sample spaces, events, conditional probability, independence, random variables, probability distributions, expectation, variance, moment generating functions, and limit theorems.'
            },
            {
                'code': 'STAT 395',
                'title': 'Probability II',
                'description': 'Continuation of STAT 394. Topics include multivariate distributions, transformations of random variables, order statistics, conditional distributions, covariance, correlation, and additional limit theorems.'
            },
            {
                'code': 'STAT 421',
                'title': 'Introduction to Statistical Methods',
                'description': 'Statistical methods for data analysis. Topics include descriptive statistics, probability, sampling distributions, estimation, hypothesis testing, analysis of variance, regression, and nonparametric methods. Emphasis on applications.'
            },
            {
                'code': 'STAT 422',
                'title': 'Applied Statistics and Experimental Design',
                'description': 'Applied statistics with emphasis on experimental design. Topics include analysis of variance, factorial designs, randomized blocks, Latin squares, regression analysis, and analysis of covariance. Applications to scientific experiments.'
            },
            {
                'code': 'STAT 423',
                'title': 'Applied Regression and Analysis of Variance',
                'description': 'Regression analysis and analysis of variance. Topics include simple and multiple linear regression, model selection, diagnostics, transformations, one-way and two-way ANOVA, and analysis of covariance. Emphasis on practical applications.'
            },
            {
                'code': 'STAT 425',
                'title': 'Introduction to Nonparametric Statistics',
                'description': 'Nonparametric statistical methods. Topics include rank tests, sign tests, Wilcoxon tests, Kruskal-Wallis test, permutation tests, bootstrap methods, and nonparametric regression. Applications when parametric assumptions are not met.'
            },
            {
                'code': 'STAT 435',
                'title': 'Introduction to Statistical Machine Learning',
                'description': 'Introduction to statistical methods for machine learning. Topics include supervised learning (regression, classification), unsupervised learning (clustering, dimensionality reduction), model selection, cross-validation, and evaluation metrics.'
            },
            {
                'code': 'STAT 441',
                'title': 'Statistical Computing',
                'description': 'Advanced statistical computing techniques. Topics include numerical methods, optimization, simulation, Monte Carlo methods, bootstrap, permutation tests, and computational statistics. Programming in R and other statistical software.'
            },
            {
                'code': 'STAT 448',
                'title': 'Introduction to Time Series Analysis',
                'description': 'Statistical methods for time series data. Topics include trend and seasonality, autocorrelation, ARIMA models, forecasting, spectral analysis, and state space models. Applications to economic, environmental, and scientific time series.'
            },
            {
                'code': 'STAT 481',
                'title': 'Introduction to Mathematical Statistics',
                'description': 'Mathematical foundations of statistics. Topics include probability theory, random variables, distributions, expectation, variance, sampling distributions, maximum likelihood estimation, and hypothesis testing. Mathematical rigor emphasized.'
            },
            {
                'code': 'STAT 482',
                'title': 'Mathematical Statistics',
                'description': 'Continuation of STAT 481. Topics include sufficient statistics, completeness, uniformly minimum variance unbiased estimation, maximum likelihood estimation, likelihood ratio tests, Bayesian inference, and decision theory.'
            },
            {
                'code': 'STAT 486',
                'title': 'Bayesian Statistics',
                'description': 'Introduction to Bayesian statistical methods. Topics include prior and posterior distributions, Bayesian inference, conjugate priors, Bayesian regression, hierarchical models, Markov chain Monte Carlo (MCMC), and Bayesian model selection.'
            },
            {
                'code': 'STAT 490',
                'title': 'Statistical Consulting',
                'description': 'Practical experience in statistical consulting. Students work on real-world statistical problems, learn to communicate with clients, design studies, analyze data, and present results. Emphasis on professional skills and ethical practice.'
            },
        ]

        # Graduate level Statistics courses (500+ level)
        graduate_courses = [
            {
                'code': 'STAT 502',
                'title': 'Design and Analysis of Experiments',
                'description': 'Design of experiments covering concepts such as randomization, blocking, and confounding. Analysis of experiments using randomization tests, analysis of variance, and analysis of covariance. Prerequisite: either STAT 342, STAT 390/MATH 390, or STAT 509/CS&SS 509/ECON 580; and MATH 208.'
            },
            {
                'code': 'STAT 503',
                'title': 'Practical Methods for Data Analysis',
                'description': 'Basic exploratory data analysis with business examples. Data summaries, multivariate data, time series, multiway tables. Techniques include graphical display, transformation, outlier identification, cluster analysis, smoothing, regression, robustness.'
            },
            {
                'code': 'STAT 504',
                'title': 'Applied Regression Analysis',
                'description': 'Applied regression analysis covering simple and multiple linear regression, model diagnostics, transformations, variable selection, multicollinearity, and nonlinear regression. Emphasis on practical applications and interpretation of results.'
            },
            {
                'code': 'STAT 509',
                'title': 'Statistical Methods for the Social Sciences',
                'description': 'Statistical methods for social science research. Topics include regression analysis, analysis of variance, categorical data analysis, and multivariate methods. Applications to social science data and research design.'
            },
            {
                'code': 'STAT 512',
                'title': 'Statistical Inference',
                'description': 'Review of random variables; transformations, conditional expectation, moment generating functions, convergence, limit theorems, estimation; Cramer-Rao lower bound, maximum likelihood estimation, sufficiency, ancillarity, completeness. Rao-Blackwell theorem. Hypothesis testing: Neyman-Pearson lemma, monotone likelihood ratio, likelihood-ratio tests, large-sample theory.'
            },
            {
                'code': 'STAT 513',
                'title': 'Statistical Inference II',
                'description': 'Continuation of STAT 512. Topics include further exploration of hypothesis testing, confidence intervals, decision theory, contingency tables, invariance, and advanced topics in statistical inference.'
            },
            {
                'code': 'STAT 516',
                'title': 'Stochastic Modeling of Scientific Data',
                'description': 'Covers discrete-time Markov chain theory; inference for discrete-time Markov chains; Monte Carlo methods; missing data; hidden Markov models; and Gaussian Markov random fields. Applications to scientific data analysis.'
            },
            {
                'code': 'STAT 517',
                'title': 'Stochastic Processes',
                'description': 'Introduction to stochastic processes. Topics include Poisson processes, renewal processes, Markov chains, continuous-time Markov processes, Brownian motion, and stochastic differential equations. Applications to modeling and analysis.'
            },
            {
                'code': 'STAT 518',
                'title': 'Stochastic Processes II',
                'description': 'Continuation of STAT 517. Advanced topics in stochastic processes including martingales, diffusion processes, stochastic calculus, and applications to finance, biology, and physics.'
            },
            {
                'code': 'STAT 520',
                'title': 'Statistical Methods for Data Science',
                'description': 'Statistical methods for data science applications. Topics include exploratory data analysis, statistical learning, model selection, cross-validation, bootstrap methods, and statistical computing. Emphasis on practical data analysis.'
            },
            {
                'code': 'STAT 530',
                'title': 'Applied Multivariate Analysis',
                'description': 'Multivariate statistical methods including multivariate normal distribution, principal components analysis, factor analysis, canonical correlation, discriminant analysis, and cluster analysis. Applications to multivariate data.'
            },
            {
                'code': 'STAT 535',
                'title': 'Statistical Learning',
                'description': 'Statistical methods for machine learning. Topics include supervised learning (regression, classification), unsupervised learning, model selection, regularization, cross-validation, and evaluation metrics. Emphasis on statistical foundations.'
            },
            {
                'code': 'STAT 536',
                'title': 'Statistical Learning II',
                'description': 'Advanced topics in statistical learning including kernel methods, support vector machines, neural networks, ensemble methods, and deep learning. Theoretical foundations and practical applications.'
            },
            {
                'code': 'STAT 540',
                'title': 'Bayesian Statistics',
                'description': 'Introduction to Bayesian statistical methods. Topics include prior and posterior distributions, Bayesian inference, conjugate priors, Bayesian regression, hierarchical models, Markov chain Monte Carlo (MCMC), and Bayesian model selection.'
            },
            {
                'code': 'STAT 541',
                'title': 'Bayesian Statistics II',
                'description': 'Advanced topics in Bayesian statistics including computational methods, model comparison, Bayesian nonparametrics, and applications to complex models. Emphasis on modern computational techniques.'
            },
            {
                'code': 'STAT 548',
                'title': 'Time Series Analysis',
                'description': 'Statistical methods for time series data. Topics include trend and seasonality, autocorrelation, ARIMA models, forecasting, spectral analysis, state space models, and multivariate time series. Applications to economic and scientific data.'
            },
            {
                'code': 'STAT 550',
                'title': 'Categorical Data Analysis',
                'description': 'Statistical methods for categorical data. Topics include contingency tables, logistic regression, log-linear models, generalized linear models, and methods for ordinal and nominal data. Applications to categorical outcomes.'
            },
            {
                'code': 'STAT 560',
                'title': 'Survival Analysis',
                'description': 'Statistical methods for time-to-event data. Topics include censoring, survival functions, hazard functions, Kaplan-Meier estimation, Cox proportional hazards model, and competing risks. Applications to medical and engineering data.'
            },
            {
                'code': 'STAT 570',
                'title': 'Nonparametric Statistics',
                'description': 'Nonparametric statistical methods. Topics include rank tests, sign tests, Wilcoxon tests, permutation tests, bootstrap methods, kernel smoothing, and nonparametric regression. Applications when parametric assumptions are not met.'
            },
            {
                'code': 'STAT 580',
                'title': 'Computational Statistics',
                'description': 'Computational methods in statistics. Topics include numerical optimization, Monte Carlo methods, Markov chain Monte Carlo (MCMC), bootstrap, permutation tests, and computational algorithms for statistical inference.'
            },
            {
                'code': 'STAT 581',
                'title': 'Mathematical Statistics I',
                'description': 'Mathematical foundations of statistics. Topics include probability theory, random variables, distributions, expectation, variance, sampling distributions, maximum likelihood estimation, and hypothesis testing. Mathematical rigor emphasized.'
            },
            {
                'code': 'STAT 582',
                'title': 'Mathematical Statistics II',
                'description': 'Continuation of STAT 581. Topics include sufficient statistics, completeness, uniformly minimum variance unbiased estimation, maximum likelihood estimation, likelihood ratio tests, Bayesian inference, and decision theory.'
            },
            {
                'code': 'STAT 590',
                'title': 'Statistical Consulting',
                'description': 'Practical experience in statistical consulting. Graduate students work on real-world statistical problems, learn to communicate with clients, design studies, analyze data, and present results. Emphasis on professional skills and ethical practice.'
            },
            {
                'code': 'STAT 591',
                'title': 'Special Topics in Statistics',
                'description': 'Special topics in statistics. Topics vary by quarter and may include advanced methods, current research areas, or specialized applications. May be repeated for credit when topics differ.'
            },
            {
                'code': 'STAT 600',
                'title': 'Independent Study or Research',
                'description': 'Independent study or research in statistics under the direction of a faculty member. May be repeated for credit. Prerequisite: permission of instructor.'
            },
        ]

        # Combine undergraduate and graduate courses
        all_courses = statistics_courses + graduate_courses

        # Create Statistics courses
        created_courses = []
        for course_data in all_courses:
            course, created = Course.objects.get_or_create(
                code=course_data['code'],
                defaults={
                    'title': course_data['title'],
                    'department': stat_dept,
                    'description': course_data['description']
                }
            )
            created_courses.append(course)
            if created:
                self.stdout.write(f'  Created: {course.code} - {course.title}')
            else:
                self.stdout.write(f'  Already exists: {course.code} - {course.title}')

        # Create some Statistics professors (common names in the field)
        stat_professors = [
            {'name': 'Michael Perlman', 'department': stat_dept},
            {'name': 'Jon Wellner', 'department': stat_dept},
            {'name': 'Adrian Raftery', 'department': stat_dept},
            {'name': 'Daniela Witten', 'department': stat_dept},
            {'name': 'Emily Fox', 'department': stat_dept},
            {'name': 'Rebecca Nugent', 'department': stat_dept},
        ]

        created_professors = []
        for prof_data in stat_professors:
            prof, created = Professor.objects.get_or_create(
                name=prof_data['name'],
                defaults={'department': prof_data['department']}
            )
            created_professors.append(prof)
            if created:
                self.stdout.write(f'  Created professor: {prof.name}')

        # Create sample reviews for popular Statistics courses
        if created_courses and created_professors:
            # Helper function to create reviews
            def create_review(course_code, prof_index, rating, workload, difficulty, comment):
                course = next((c for c in created_courses if c.code == course_code), None)
                if course and prof_index < len(created_professors):
                    Review.objects.get_or_create(
                        course=course,
                        professor=created_professors[prof_index],
                        defaults={
                            'rating': rating,
                            'workload': workload,
                            'difficulty': difficulty,
                            'comment': comment
                        }
                    )
            
            # STAT 220 - Statistical Reasoning (popular intro course)
            create_review('STAT 220', 0, 4, 3, 2, 'Great intro course! Covers the basics well and the professor explains concepts clearly. Good for non-majors who need stats.')
            create_review('STAT 220', 1, 5, 2, 2, 'Excellent course! Very accessible and well-organized. The examples are practical and easy to understand.')
            create_review('STAT 220', 0, 4, 3, 3, 'Solid foundation in statistical reasoning. Homework is manageable and exams are fair.')
            
            # STAT 221 - Statistical Concepts for Social Sciences
            create_review('STAT 221', 1, 4, 3, 3, 'Good course for social science majors. The applications are relevant and the material is well-presented.')
            create_review('STAT 221', 2, 3, 4, 3, 'Decent course but can be challenging. Make sure to keep up with the readings.')
            
            # STAT 311 - Elements of Statistical Methods
            create_review('STAT 311', 0, 4, 3, 3, 'Great introduction to statistics! The course covers essential concepts clearly. Homework is reasonable and exams are fair.')
            create_review('STAT 311', 1, 5, 2, 2, 'Excellent professor! Makes statistics accessible and interesting. Highly recommend for anyone needing a stats foundation.')
            create_review('STAT 311', 0, 4, 3, 3, 'Well-structured course with good examples. The R labs are helpful for understanding the concepts.')
            create_review('STAT 311', 2, 4, 4, 3, 'Challenging but fair. The professor is knowledgeable and willing to help during office hours.')
            
            # STAT 390 - Statistical Methods in Engineering
            create_review('STAT 390', 2, 4, 3, 3, 'Good course for engineers. Covers practical statistical methods used in engineering applications.')
            create_review('STAT 390', 3, 5, 3, 3, 'Excellent course! Very applicable to real engineering problems. The professor explains things well.')
            create_review('STAT 390', 2, 4, 4, 4, 'Challenging but useful. The homework problems are realistic and help reinforce the concepts.')
            
            # STAT 391 - Probability and Statistics in CS
            create_review('STAT 391', 3, 5, 3, 3, 'Perfect for CS majors! The course connects statistics to computer science applications nicely.')
            create_review('STAT 391', 4, 4, 3, 3, 'Good course with relevant examples for CS students. The programming assignments are helpful.')
            
            # STAT 394 - Probability I
            create_review('STAT 394', 2, 4, 4, 4, 'Challenging but well-taught. The mathematical rigor is important for understanding probability theory. Be prepared to work hard.')
            create_review('STAT 394', 3, 5, 3, 4, 'Excellent professor! Makes probability theory accessible. The proofs are clear and well-explained.')
            create_review('STAT 394', 2, 4, 4, 5, 'Very theoretical course. Requires strong math background. Challenging but rewarding.')
            
            # STAT 395 - Probability II
            create_review('STAT 395', 3, 4, 4, 4, 'Continuation of STAT 394. Builds nicely on the previous material. More challenging but manageable.')
            create_review('STAT 395', 4, 5, 3, 4, 'Great follow-up course. The professor explains multivariate distributions clearly.')
            
            # STAT 416 - Introduction to Machine Learning
            create_review('STAT 416', 4, 5, 4, 3, 'Excellent course! Covers machine learning from a statistical perspective. Very relevant and practical.')
            create_review('STAT 416', 5, 4, 4, 4, 'Great introduction to ML. The assignments are interesting and help you understand the algorithms.')
            create_review('STAT 416', 4, 5, 3, 3, 'One of the best courses I\'ve taken! The professor is engaging and the material is cutting-edge.')
            
            # STAT 423 - Applied Regression
            create_review('STAT 423', 3, 5, 3, 3, 'Very practical course! The regression techniques are directly applicable to real data analysis. Great for research.')
            create_review('STAT 423', 4, 4, 4, 3, 'Good course on regression. The homework problems are realistic and help you understand the methods.')
            create_review('STAT 423', 3, 5, 3, 3, 'Excellent professor! Makes regression analysis clear and applicable. Highly recommend.')
            
            # STAT 425 - Nonparametric Statistics
            create_review('STAT 425', 4, 4, 3, 3, 'Interesting course on nonparametric methods. Useful when parametric assumptions don\'t hold.')
            create_review('STAT 425', 5, 4, 3, 3, 'Good coverage of nonparametric tests. The examples are helpful for understanding when to use these methods.')
            
            # STAT 504 - Applied Regression (Graduate)
            create_review('STAT 504', 3, 5, 3, 3, 'Excellent graduate-level regression course. Very thorough and practical.')
            create_review('STAT 504', 4, 4, 4, 3, 'Comprehensive coverage of regression methods. The assignments are challenging but educational.')
            
            # STAT 513 - Statistical Inference (Graduate)
            create_review('STAT 513', 2, 4, 4, 5, 'Very theoretical course. Requires strong mathematical background. Challenging but important for understanding inference.')
            create_review('STAT 513', 3, 5, 3, 4, 'Excellent course on statistical inference. The professor explains the theory clearly.')
            
            # STAT 538 - Statistical Learning (Graduate)
            create_review('STAT 538', 4, 5, 4, 3, 'Great course on statistical learning! Covers modern methods and their theoretical foundations.')
            create_review('STAT 538', 5, 4, 4, 4, 'Challenging but rewarding. The material is very relevant to current research.')
            
            # STAT 544 - Bayesian Methods (Graduate)
            create_review('STAT 544', 3, 5, 3, 4, 'Excellent introduction to Bayesian statistics. The MCMC methods are well-explained.')
            create_review('STAT 544', 4, 4, 3, 3, 'Great course! Bayesian methods are becoming increasingly important in modern statistics.')
            
            self.stdout.write(self.style.SUCCESS(f'\nCreated reviews for STAT courses!'))

        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully seeded {len(created_courses)} Statistics courses!'))
        self.stdout.write(self.style.SUCCESS(f'Created {len(created_professors)} Statistics professors!'))

