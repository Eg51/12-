 Compiled successfully in 3.7min
  Running TypeScript  .✓ Finished writing to filesystem cache in 33.3s
app/components/Bil.tsx(162,75): error TS2339: Property 'toFixed' does not exist on type 'never'.
app/components/Dash.tsx(2839,13): error TS2322: Type '{ username: string; className: string; iconSize: number; }' is not assignable to type 'IntrinsicAttributes & GreetProps'.
  Property 'username' does not exist on type 'IntrinsicAttributes & GreetProps'.
app/components/Greet.tsx(120,7): error TS2322: Type '{ hidden: { opacity: number; y: number; }; visible: { opacity: number; y: number; transition: { duration: number; ease: string; }; }; }' is not assignable to type 'Variants'.
  Property 'visible' is incompatible with index signature.
    Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type 'Variant'.
      Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type 'TargetAndTransition'.
        Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type '{ transition?: Transition<any> | undefined; transitionEnd?: ResolvedValues$1 | undefined; }'.
          Types of property 'transition' are incompatible.
            Type '{ duration: number; ease: string; }' is not assignable to type 'Transition<any> | undefined'.
              Type '{ duration: number; ease: string; }' is not assignable to type 'TransitionWithValueOverrides<any>'.
                Type '{ duration: number; ease: string; }' is not assignable to type 'ValueAnimationTransition<any>'.
                  Types of property 'ease' are incompatible.
                    Type 'string' is not assignable to type 'Easing | Easing[] | undefined'.
app/components/Greet.tsx(139,11): error TS2322: Type '{ hidden: { scale: number; rotate: number; }; visible: { scale: number; rotate: number; transition: { type: string; stiffness: number; damping: number; delay: number; }; }; }' is not assignable to type 'Variants'.
  Property 'visible' is incompatible with index signature.
    Type '{ scale: number; rotate: number; transition: { type: string; stiffness: number; damping: number; delay: number; }; }' is not assignable to type 'Variant'.
      Type '{ scale: number; rotate: number; transition: { type: string; stiffness: number; damping: number; delay: number; }; }' is not assignable to type 'TargetAndTransition'.
        Type '{ scale: number; rotate: number; transition: { type: string; stiffness: number; damping: number; delay: number; }; }' is not assignable to type '{ transition?: Transition<any> | undefined; transitionEnd?: ResolvedValues$1 | undefined; }'.
          Types of property 'transition' are incompatible.
            Type '{ type: string; stiffness: number; damping: number; delay: number; }' is not assignable to type 'Transition<any> | undefined'.
              Type '{ type: string; stiffness: number; damping: number; delay: number; }' is not assignable to type 'TransitionWithValueOverrides<any>'.
                Type '{ type: string; stiffness: number; damping: number; delay: number; }' is not assignable to type 'ValueAnimationTransition<any>'.
                  Types of property 'type' are incompatible.
                    Type 'string' is not assignable to type 'AnimationGeneratorType | undefined'.
app/components/Logge.tsx(914,21): error TS2322: Type '{ hidden: { opacity: number; y: number; }; visible: { opacity: number; y: number; transition: { duration: number; ease: string; }; }; }' is not assignable to type 'Variants'.
  Property 'visible' is incompatible with index signature.
    Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type 'Variant'.
      Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type 'TargetAndTransition'.
        Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type '{ transition?: Transition<any> | undefined; transitionEnd?: ResolvedValues$1 | undefined; }'.
          Types of property 'transition' are incompatible.
            Type '{ duration: number; ease: string; }' is not assignable to type 'Transition<any> | undefined'.
              Type '{ duration: number; ease: string; }' is not assignable to type 'TransitionWithValueOverrides<any>'.
                Type '{ duration: number; ease: string; }' is not assignable to type 'ValueAnimationTransition<any>'.
                  Types of property 'ease' are incompatible.
                    Type 'string' is not assignable to type 'Easing | Easing[] | undefined'.
app/components/Logge.tsx(922,13): error TS2322: Type '{ hidden: { opacity: number; scale: number; }; visible: { opacity: number; scale: number; transition: { duration: number; ease: string; }; }; }' is not assignable to type 'Variants'.
  Property 'visible' is incompatible with index signature.
    Type '{ opacity: number; scale: number; transition: { duration: number; ease: string; }; }' is not assignable to type 'Variant'.
      Type '{ opacity: number; scale: number; transition: { duration: number; ease: string; }; }' is not assignable to type 'TargetAndTransition'.
        Type '{ opacity: number; scale: number; transition: { duration: number; ease: string; }; }' is not assignable to type '{ transition?: Transition<any> | undefined; transitionEnd?: ResolvedValues$1 | undefined; }'.
          Types of property 'transition' are incompatible.
            Type '{ duration: number; ease: string; }' is not assignable to type 'Transition<any> | undefined'.
              Type '{ duration: number; ease: string; }' is not assignable to type 'TransitionWithValueOverrides<any>'.
                Type '{ duration: number; ease: string; }' is not assignable to type 'ValueAnimationTransition<any>'.
                  Types of property 'ease' are incompatible.
                    Type 'string' is not assignable to type 'Easing | Easing[] | undefined'.
app/components/Logge.tsx(1053,23): error TS2322: Type '{ hidden: { opacity: number; scale: number; }; visible: { opacity: number; scale: number; transition: { duration: number; ease: string; }; }; }' is not assignable to type 'Variants'.
  Property 'visible' is incompatible with index signature.
    Type '{ opacity: number; scale: number; transition: { duration: number; ease: string; }; }' is not assignable to type 'Variant'.
      Type '{ opacity: number; scale: number; transition: { duration: number; ease: string; }; }' is not assignable to type 'TargetAndTransition'.
        Type '{ opacity: number; scale: number; transition: { duration: number; ease: string; }; }' is not assignable to type '{ transition?: Transition<any> | undefined; transitionEnd?: ResolvedValues$1 | undefined; }'.
          Types of property 'transition' are incompatible.
            Type '{ duration: number; ease: string; }' is not assignable to type 'Transition<any> | undefined'.
              Type '{ duration: number; ease: string; }' is not assignable to type 'TransitionWithValueOverrides<any>'.
                Type '{ duration: number; ease: string; }' is not assignable to type 'ValueAnimationTransition<any>'.
                  Types of property 'ease' are incompatible.
                    Type 'string' is not assignable to type 'Easing | Easing[] | undefined'.
Failed to type check.
