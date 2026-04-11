const Container = ({ children, className = '' }) => {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10 ${className}`.trim()}>
      {children}
    </div>
  );
};

export default Container;
